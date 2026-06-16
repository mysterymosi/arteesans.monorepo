-- Persist a customer's default address with optional PostGIS coordinates.

create or replace function public.upsert_customer_default_address(
  p_line1 text,
  p_state text,
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
  v_address_id uuid;
  v_existing_id uuid;
begin
  if public.current_user_role() is distinct from 'customer' then
    raise exception 'Only customers can save addresses';
  end if;

  select default_address_id
  into v_existing_id
  from public.customer_profiles
  where user_id = auth.uid();

  if v_existing_id is not null then
    update public.addresses
    set
      line1 = p_line1,
      city_lga = p_city_lga,
      state = p_state,
      location = case
        when p_latitude is not null and p_longitude is not null then
          st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography
        else null
      end,
      is_default = true,
      label = coalesce(label, 'Home')
    where id = v_existing_id
      and user_id = auth.uid()
    returning id into v_address_id;
  else
    insert into public.addresses (
      user_id,
      line1,
      city_lga,
      state,
      location,
      is_default,
      label
    )
    values (
      auth.uid(),
      p_line1,
      p_city_lga,
      p_state,
      case
        when p_latitude is not null and p_longitude is not null then
          st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography
        else null
      end,
      true,
      'Home'
    )
    returning id into v_address_id;

    insert into public.customer_profiles (user_id, default_address_id)
    values (auth.uid(), v_address_id)
    on conflict (user_id) do update
    set default_address_id = excluded.default_address_id;
  end if;

  return v_address_id;
end;
$$;

grant execute on function public.upsert_customer_default_address(
  text, text, text, double precision, double precision
) to authenticated;
