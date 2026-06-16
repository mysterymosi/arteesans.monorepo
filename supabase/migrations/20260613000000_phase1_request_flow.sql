-- Phase 1.3: request media storage + service request creation RPC

insert into storage.buckets (id, name, public, file_size_limit)
values ('request-media', 'request-media', false, 524288)
on conflict (id) do nothing;

create policy request_media_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'request-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy request_media_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'request-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create or replace function public.create_service_request(
  p_category_id uuid,
  p_description text,
  p_urgency public.urgency_level,
  p_address text,
  p_latitude double precision,
  p_longitude double precision,
  p_preferred_time timestamptz default null,
  p_budget numeric default null,
  p_media_paths text[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_request_id uuid;
begin
  if public.current_user_role() is distinct from 'customer' then
    raise exception 'Only customers can create service requests';
  end if;

  insert into public.service_requests (
    customer_id,
    category_id,
    description,
    urgency,
    preferred_time,
    budget,
    address,
    location,
    media_paths,
    status
  )
  values (
    auth.uid(),
    p_category_id,
    p_description,
    p_urgency,
    p_preferred_time,
    p_budget,
    p_address,
    st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography,
    coalesce(p_media_paths, '{}'),
    'matching'
  )
  returning id into v_request_id;

  return v_request_id;
end;
$$;

grant execute on function public.create_service_request(
  uuid, text, public.urgency_level, text, double precision, double precision, timestamptz, numeric, text[]
) to authenticated;
