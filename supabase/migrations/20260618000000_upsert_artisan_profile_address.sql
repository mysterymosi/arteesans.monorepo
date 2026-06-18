-- Persist artisan address and PostGIS location from sign-up metadata.

create or replace function public.upsert_artisan_profile_address(
  p_address text,
  p_state text default null,
  p_city_lga text default null,
  p_latitude double precision default null,
  p_longitude double precision default null
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_profile_id uuid;
begin
  if public.current_user_role() is distinct from 'artisan' then
    raise exception 'Only artisans can save artisan profile address';
  end if;

  insert into public.artisan_profiles (user_id, address, state, city_lga, location)
  values (
    auth.uid(),
    p_address,
    p_state,
    p_city_lga,
    case
      when p_latitude is not null and p_longitude is not null then
        st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography
      else null
    end
  )
  on conflict (user_id) do update
  set
    address = excluded.address,
    state = excluded.state,
    city_lga = excluded.city_lga,
    location = excluded.location,
    updated_at = now()
  returning id into v_profile_id;

  return v_profile_id;
end;
$$;

grant execute on function public.upsert_artisan_profile_address(
  text, text, text, double precision, double precision
) to authenticated;
