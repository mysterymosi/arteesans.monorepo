-- Admin read model for service request details with numeric coordinates.
-- Keeps PostGIS parsing in Postgres instead of application code.
set search_path = public, extensions;

create or replace view public.admin_service_request_details
with (security_invoker = true) as
select
  sr.id,
  sr.customer_id,
  sr.category_id,
  sr.description,
  sr.status,
  sr.urgency,
  sr.address,
  sr.created_at,
  sr.budget,
  sr.preferred_time,
  sr.media_paths,
  case
    when sr.location is null then null
    else st_y(sr.location::geometry)
  end::double precision as latitude,
  case
    when sr.location is null then null
    else st_x(sr.location::geometry)
  end::double precision as longitude
from public.service_requests sr;

grant select on public.admin_service_request_details to authenticated, service_role;
