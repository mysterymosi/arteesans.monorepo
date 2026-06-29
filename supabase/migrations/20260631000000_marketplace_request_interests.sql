-- Phase 3: Marketplace request flow — artisan interests and customer selection.

create type public.request_interest_status as enum (
  'pending',
  'withdrawn',
  'selected',
  'declined',
  'expired'
);

create table public.request_artisan_interests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests (id) on delete cascade,
  artisan_id uuid not null references public.users (id) on delete cascade,
  status public.request_interest_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, artisan_id)
);

create index request_artisan_interests_request_status_idx
  on public.request_artisan_interests (request_id, status);

create index request_artisan_interests_artisan_status_idx
  on public.request_artisan_interests (artisan_id, status);

create trigger request_artisan_interests_updated_at
  before update on public.request_artisan_interests
  for each row execute function public.handle_updated_at();

alter table public.request_artisan_interests enable row level security;

create policy request_artisan_interests_artisan_select on public.request_artisan_interests
  for select to authenticated
  using (artisan_id = auth.uid());

create policy request_artisan_interests_customer_select on public.request_artisan_interests
  for select to authenticated
  using (
    exists (
      select 1
      from public.service_requests sr
      where sr.id = request_artisan_interests.request_id
        and sr.customer_id = auth.uid()
    )
  );

-- Customers can preview artisan profiles for pending interests.
create policy users_select_interested_artisan on public.users
  for select to authenticated
  using (
    role = 'artisan'
    and exists (
      select 1
      from public.request_artisan_interests rai
      join public.service_requests sr on sr.id = rai.request_id
      where sr.customer_id = auth.uid()
        and rai.artisan_id = users.id
        and rai.status = 'pending'
    )
  );

create policy artisan_profiles_select_interested on public.artisan_profiles
  for select to authenticated
  using (
    verification_status = 'approved'
    and exists (
      select 1
      from public.request_artisan_interests rai
      join public.service_requests sr on sr.id = rai.request_id
      where sr.customer_id = auth.uid()
        and rai.artisan_id = artisan_profiles.user_id
        and rai.status = 'pending'
    )
  );

-- ---------------------------------------------------------------------------
-- Eligibility helper (mirrors generate_match_suggestions candidate rules)
-- ---------------------------------------------------------------------------
create or replace function public.is_artisan_eligible_for_request(
  p_artisan_id uuid,
  p_request_id uuid,
  p_max_radius_meters double precision default 50000
)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from public.service_requests sr
    join public.artisan_profiles ap on ap.user_id = p_artisan_id
    where sr.id = p_request_id
      and sr.status = 'matching'
      and ap.verification_status = 'approved'
      and (
        ap.primary_skill_category_id = sr.category_id
        or sr.category_id = any (ap.additional_skill_category_ids)
      )
      and (
        sr.preferred_time is null
        or ap.availability in ('full_time', 'flexible', 'on_demand')
        or (
          extract(isodow from sr.preferred_time) in (6, 7)
          and ap.availability = 'weekends_only'
        )
        or (
          extract(isodow from sr.preferred_time) between 1 and 5
          and ap.availability = 'part_time'
        )
        or ap.availability is null
      )
      and (
        sr.location is null
        or ap.location is null
        or p_max_radius_meters <= 0
        or st_distance(sr.location, ap.location) <= p_max_radius_meters
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Reopen helper — extend for marketplace decline from accepted
-- ---------------------------------------------------------------------------
create or replace function public.reopen_request_for_matching(
  p_request_id uuid,
  p_reason text,
  p_actor_id uuid,
  p_source text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
begin
  select *
  into v_request
  from public.service_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'Request not found';
  end if;

  if v_request.status not in ('confirmed', 'matched', 'accepted') then
    raise exception 'Request cannot be reopened from status %', v_request.status;
  end if;

  if v_request.status = 'accepted' and p_source is distinct from 'artisan_decline_selected' then
    raise exception 'Accepted jobs can only be reopened via artisan decline';
  end if;

  update public.service_requests
  set
    status = 'matching',
    assigned_artisan_id = null,
    accept_deadline_at = null,
    reject_reason = p_reason,
    updated_at = now()
  where id = p_request_id;

  if p_source = 'artisan_decline_selected' then
    update public.request_artisan_interests
    set
      status = 'withdrawn',
      updated_at = now()
    where request_id = p_request_id
      and artisan_id = p_actor_id
      and status = 'selected';
  else
    update public.request_artisan_interests
    set
      status = 'expired',
      updated_at = now()
    where request_id = p_request_id
      and status = 'pending';
  end if;

  insert into public.admin_actions (
    actor_id,
    action_type,
    entity_type,
    entity_id,
    metadata
  )
  values (
    p_actor_id,
    'reassign',
    'service_request',
    p_request_id,
    jsonb_build_object(
      'source', p_source,
      'reason', p_reason,
      'previous_status', v_request.status,
      'previous_artisan_id', v_request.assigned_artisan_id
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Marketplace RPCs
-- ---------------------------------------------------------------------------
create or replace function public.list_open_requests_for_artisan(
  p_max_radius_meters double precision default 50000
)
returns table (
  request_id uuid,
  category_id uuid,
  category_name text,
  category_slug text,
  description text,
  urgency public.urgency_level,
  address text,
  budget numeric,
  preferred_time timestamptz,
  distance_meters double precision,
  score double precision,
  created_at timestamptz,
  interest_status public.request_interest_status
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  with artisan_scope as (
    select ap.*
    from public.artisan_profiles ap
    where ap.user_id = auth.uid()
      and ap.verification_status = 'approved'
  ),
  eligible as (
    select
      sr.id as request_id,
      sr.category_id,
      sc.name as category_name,
      sc.slug as category_slug,
      sr.description,
      sr.urgency,
      sr.address,
      sr.budget,
      sr.preferred_time,
      sr.created_at,
      case
        when sr.location is null or a.location is null then null
        else st_distance(sr.location, a.location)
      end as distance_meters,
      case
        when sr.preferred_time is null then 1.0
        when a.availability in ('full_time', 'flexible', 'on_demand') then 1.0
        when extract(isodow from sr.preferred_time) in (6, 7)
          and a.availability = 'weekends_only' then 1.0
        when extract(isodow from sr.preferred_time) between 1 and 5
          and a.availability = 'part_time' then 0.85
        when a.availability is null then 0.5
        else 0.0
      end as availability_score,
      rai.status as interest_status
    from public.service_requests sr
    cross join artisan_scope a
    join public.service_categories sc on sc.id = sr.category_id
    left join public.request_artisan_interests rai
      on rai.request_id = sr.id
      and rai.artisan_id = auth.uid()
    where sr.status = 'matching'
      and (
        a.primary_skill_category_id = sr.category_id
        or sr.category_id = any (a.additional_skill_category_ids)
      )
      and (
        sr.preferred_time is null
        or a.availability in ('full_time', 'flexible', 'on_demand')
        or (
          extract(isodow from sr.preferred_time) in (6, 7)
          and a.availability = 'weekends_only'
        )
        or (
          extract(isodow from sr.preferred_time) between 1 and 5
          and a.availability = 'part_time'
        )
        or a.availability is null
      )
      and (
        sr.location is null
        or a.location is null
        or p_max_radius_meters <= 0
        or st_distance(sr.location, a.location) <= p_max_radius_meters
      )
      and coalesce(rai.status, 'pending') not in ('selected', 'declined')
  ),
  scored as (
    select
      e.*,
      case
        when e.distance_meters is null then 0.0
        when p_max_radius_meters <= 0 then 0.0
        else greatest(0.0, 1.0 - (e.distance_meters / p_max_radius_meters))
      end as location_score
    from eligible e
  )
  select
    s.request_id,
    s.category_id,
    s.category_name,
    s.category_slug,
    s.description,
    s.urgency,
    s.address,
    s.budget,
    s.preferred_time,
    s.distance_meters,
    (
      (0.30 * 1.0)
      + (0.25 * s.location_score)
      + (0.20 * s.availability_score)
      + (0.15 * (least(greatest(a.average_rating::double precision, 0.0), 5.0) / 5.0))
      + (0.05 * least(greatest(a.completed_jobs::double precision, 0.0) / 50.0, 1.0))
      + (0.05 * 1.0)
    ) as score,
    s.created_at,
    s.interest_status
  from scored s
  cross join artisan_scope a
  order by score desc, s.distance_meters asc nulls last, s.created_at desc;
$$;

create or replace function public.express_interest(p_request_id uuid)
returns public.request_interest_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.request_interest_status;
  v_status public.request_interest_status := 'pending';
begin
  if not public.is_approved_artisan() then
    raise exception 'Only approved artisans can express interest';
  end if;

  if not public.is_artisan_eligible_for_request(auth.uid(), p_request_id) then
    raise exception 'You are not eligible for this request';
  end if;

  select rai.status
  into v_existing
  from public.request_artisan_interests rai
  where rai.request_id = p_request_id
    and rai.artisan_id = auth.uid();

  if v_existing = 'pending' then
    raise exception 'Interest already expressed';
  end if;

  if v_existing = 'selected' then
    raise exception 'You are already selected for this request';
  end if;

  if v_existing is null then
    insert into public.request_artisan_interests (request_id, artisan_id, status)
    values (p_request_id, auth.uid(), 'pending');
  else
    update public.request_artisan_interests
    set
      status = 'pending',
      updated_at = now()
    where request_id = p_request_id
      and artisan_id = auth.uid()
      and status in ('withdrawn', 'declined', 'expired');
  end if;

  return v_status;
end;
$$;

create or replace function public.withdraw_interest(p_request_id uuid)
returns public.request_interest_status
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_approved_artisan() then
    raise exception 'Only approved artisans can withdraw interest';
  end if;

  update public.request_artisan_interests
  set
    status = 'withdrawn',
    updated_at = now()
  where request_id = p_request_id
    and artisan_id = auth.uid()
    and status = 'pending';

  if not found then
    raise exception 'No pending interest to withdraw';
  end if;

  return 'withdrawn';
end;
$$;

create or replace function public.list_request_interests(p_request_id uuid)
returns table (
  interest_id uuid,
  artisan_id uuid,
  first_name text,
  last_name text,
  profile_photo_url text,
  average_rating numeric,
  completed_jobs integer,
  city_lga text,
  state text,
  distance_meters double precision,
  score double precision,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  with request_scope as (
    select sr.*
    from public.service_requests sr
    where sr.id = p_request_id
      and sr.customer_id = auth.uid()
      and sr.status = 'matching'
  ),
  interests as (
    select
      rai.id as interest_id,
      rai.artisan_id,
      rai.created_at,
      u.first_name,
      u.last_name,
      u.profile_photo_url,
      ap.average_rating,
      ap.completed_jobs,
      ap.city_lga,
      ap.state,
      case
        when r.location is null or ap.location is null then null
        else st_distance(r.location, ap.location)
      end as distance_meters
    from public.request_artisan_interests rai
    join request_scope r on r.id = rai.request_id
    join public.users u on u.id = rai.artisan_id
    join public.artisan_profiles ap on ap.user_id = rai.artisan_id
    where rai.status = 'pending'
      and ap.verification_status = 'approved'
      and public.is_artisan_eligible_for_request(rai.artisan_id, p_request_id)
  )
  select
    i.interest_id,
    i.artisan_id,
    i.first_name,
    i.last_name,
    i.profile_photo_url,
    i.average_rating,
    i.completed_jobs,
    i.city_lga,
    i.state,
    i.distance_meters,
    case
      when i.distance_meters is null then 0.0
      else greatest(0.0, 1.0 - (i.distance_meters / 50000.0))
    end as score,
    i.created_at
  from interests i
  order by score desc, i.distance_meters asc nulls last, i.average_rating desc nulls last;
$$;

create or replace function public.select_artisan(
  p_request_id uuid,
  p_artisan_id uuid
)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
begin
  v_request := public.assert_customer_request(p_request_id, 'matching');

  if not public.is_artisan_eligible_for_request(p_artisan_id, p_request_id) then
    raise exception 'Selected artisan is not eligible for this request';
  end if;

  if not exists (
    select 1
    from public.request_artisan_interests rai
    where rai.request_id = p_request_id
      and rai.artisan_id = p_artisan_id
      and rai.status = 'pending'
  ) then
    raise exception 'Selected artisan has not expressed interest';
  end if;

  update public.service_requests
  set
    assigned_artisan_id = p_artisan_id,
    status = 'accepted',
    accept_deadline_at = null,
    reject_reason = null,
    updated_at = now()
  where id = p_request_id;

  update public.request_artisan_interests
  set
    status = 'selected',
    updated_at = now()
  where request_id = p_request_id
    and artisan_id = p_artisan_id
    and status = 'pending';

  update public.request_artisan_interests
  set
    status = 'declined',
    updated_at = now()
  where request_id = p_request_id
    and artisan_id is distinct from p_artisan_id
    and status = 'pending';

  return 'accepted';
end;
$$;

create or replace function public.decline_selected_job(
  p_request_id uuid,
  p_reason text default null
)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_assigned_artisan_job(p_request_id, 'accepted');

  perform public.reopen_request_for_matching(
    p_request_id,
    coalesce(nullif(trim(p_reason), ''), 'Artisan declined the selected job'),
    auth.uid(),
    'artisan_decline_selected'
  );

  return 'matching';
end;
$$;

revoke all on function public.is_artisan_eligible_for_request(uuid, uuid, double precision) from public;
revoke all on function public.list_open_requests_for_artisan(double precision) from public;
revoke all on function public.express_interest(uuid) from public;
revoke all on function public.withdraw_interest(uuid) from public;
revoke all on function public.list_request_interests(uuid) from public;
revoke all on function public.select_artisan(uuid, uuid) from public;
revoke all on function public.decline_selected_job(uuid, text) from public;

grant execute on function public.is_artisan_eligible_for_request(uuid, uuid, double precision) to authenticated;
grant execute on function public.list_open_requests_for_artisan(double precision) to authenticated;
grant execute on function public.express_interest(uuid) to authenticated;
grant execute on function public.withdraw_interest(uuid) to authenticated;
grant execute on function public.list_request_interests(uuid) to authenticated;
grant execute on function public.select_artisan(uuid, uuid) to authenticated;
grant execute on function public.decline_selected_job(uuid, text) to authenticated;

-- Realtime for live interest counts.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'request_artisan_interests'
  ) then
    alter publication supabase_realtime add table public.request_artisan_interests;
  end if;
end
$$;
