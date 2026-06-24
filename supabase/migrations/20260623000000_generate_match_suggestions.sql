-- Ranked artisan suggestions for manual admin matching.
-- Scoring stays in Postgres because category, availability, and distance
-- calculations are data-local and PostGIS-heavy.
set search_path = public, extensions;

create or replace function public.generate_match_suggestions(
  p_request_id uuid,
  p_max_radius_meters double precision default 50000
)
returns table (
  artisan_id uuid,
  artisan_profile_id uuid,
  artisan_name text,
  category_name text,
  city_lga text,
  state text,
  availability public.availability,
  average_rating numeric,
  completed_jobs integer,
  distance_meters double precision,
  score double precision,
  category_score double precision,
  location_score double precision,
  availability_score double precision,
  rating_score double precision,
  completion_score double precision,
  response_score double precision
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with request_scope as (
    select
      sr.id,
      sr.category_id,
      sr.location,
      sr.preferred_time
    from public.service_requests sr
    where sr.id = p_request_id
      and sr.status = 'matching'
  ),
  candidates as (
    select
      ap.id as artisan_profile_id,
      ap.user_id as artisan_id,
      ap.city_lga,
      ap.state,
      ap.availability,
      ap.average_rating,
      ap.completed_jobs,
      u.first_name,
      u.last_name,
      u.email,
      sc.name as category_name,
      case
        when r.location is null or ap.location is null then null
        else st_distance(r.location, ap.location)
      end as distance_meters,
      case
        when r.preferred_time is null then 1.0
        when ap.availability in ('full_time', 'flexible', 'on_demand') then 1.0
        when extract(isodow from r.preferred_time) in (6, 7)
          and ap.availability = 'weekends_only' then 1.0
        when extract(isodow from r.preferred_time) between 1 and 5
          and ap.availability = 'part_time' then 0.85
        when ap.availability is null then 0.5
        else 0.0
      end as availability_score
    from request_scope r
    join public.artisan_profiles ap
      on ap.verification_status = 'approved'
      and (
        ap.primary_skill_category_id = r.category_id
        or r.category_id = any(ap.additional_skill_category_ids)
      )
    left join public.users u
      on u.id = ap.user_id
    left join public.service_categories sc
      on sc.id = ap.primary_skill_category_id
    where
      r.preferred_time is null
      or ap.availability in ('full_time', 'flexible', 'on_demand')
      or (
        extract(isodow from r.preferred_time) in (6, 7)
        and ap.availability = 'weekends_only'
      )
      or (
        extract(isodow from r.preferred_time) between 1 and 5
        and ap.availability = 'part_time'
      )
      or ap.availability is null
  ),
  scored as (
    select
      c.*,
      1.0::double precision as category_score,
      case
        when c.distance_meters is null then 0.0
        else greatest(0.0, 1.0 - (c.distance_meters / p_max_radius_meters))
      end as location_score,
      (least(greatest(c.average_rating::double precision, 0.0), 5.0) / 5.0) as rating_score,
      least(greatest(c.completed_jobs::double precision, 0.0) / 50.0, 1.0) as completion_score,
      1.0::double precision as response_score
    from candidates c
  )
  select
    s.artisan_id,
    s.artisan_profile_id,
    coalesce(
      nullif(trim(concat_ws(' ', s.first_name, s.last_name)), ''),
      s.email,
      'Unnamed artisan'
    ) as artisan_name,
    s.category_name,
    s.city_lga,
    s.state,
    s.availability,
    s.average_rating,
    s.completed_jobs,
    s.distance_meters,
    (
      (0.30 * s.category_score)
      + (0.25 * s.location_score)
      + (0.20 * s.availability_score)
      + (0.15 * s.rating_score)
      + (0.05 * s.completion_score)
      + (0.05 * s.response_score)
    ) as score,
    s.category_score,
    s.location_score,
    s.availability_score,
    s.rating_score,
    s.completion_score,
    s.response_score
  from scored s
  order by score desc, distance_meters asc nulls last, average_rating desc;
$$;

grant execute on function public.generate_match_suggestions(uuid, double precision)
  to authenticated, service_role;
