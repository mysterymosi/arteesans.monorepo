-- Phase 2.2: Customer booking confirm and two-party completion.

alter table public.service_requests
  add column if not exists customer_confirmed_at timestamptz;

create or replace function public.assert_customer_request(
  p_request_id uuid,
  p_expected_status public.request_status default null
)
returns public.service_requests
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
    and customer_id = auth.uid()
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if p_expected_status is not null and v_request.status is distinct from p_expected_status then
    raise exception 'Booking must be in % status', p_expected_status;
  end if;

  return v_request;
end;
$$;

create or replace function public.confirm_booking(p_request_id uuid)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
begin
  v_request := public.assert_customer_request(p_request_id, 'matched');

  update public.service_requests
  set
    status = 'confirmed',
    updated_at = now()
  where id = p_request_id;

  return 'confirmed';
end;
$$;

create or replace function public.confirm_job_completion(p_request_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
  v_confirmed_at timestamptz := now();
begin
  v_request := public.assert_customer_request(p_request_id, 'completed');

  if v_request.customer_confirmed_at is not null then
    raise exception 'Completion already confirmed';
  end if;

  update public.service_requests
  set
    customer_confirmed_at = v_confirmed_at,
    updated_at = now()
  where id = p_request_id;

  if v_request.assigned_artisan_id is not null then
    update public.artisan_profiles
    set
      completed_jobs = completed_jobs + 1,
      updated_at = now()
    where user_id = v_request.assigned_artisan_id;
  end if;

  return v_confirmed_at;
end;
$$;

revoke all on function public.assert_customer_request(uuid, public.request_status) from public;

grant execute on function public.confirm_booking(uuid) to authenticated;
grant execute on function public.confirm_job_completion(uuid) to authenticated;
