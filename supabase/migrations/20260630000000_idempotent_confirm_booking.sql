-- Allow confirm_booking retries when the booking is already confirmed.

create or replace function public.confirm_booking(p_request_id uuid)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
begin
  v_request := public.assert_customer_request(p_request_id);

  if v_request.status = 'confirmed' then
    return 'confirmed';
  end if;

  if v_request.status is distinct from 'matched' then
    raise exception 'Booking must be in matched status';
  end if;

  update public.service_requests
  set
    status = 'confirmed',
    updated_at = now()
  where id = p_request_id;

  return 'confirmed';
end;
$$;
