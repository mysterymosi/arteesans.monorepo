-- Idempotent customer push per committed job status transition.

create table public.job_status_notifications (
  request_id uuid not null references public.service_requests(id) on delete cascade,
  status public.request_status not null,
  sent_at timestamptz not null default now(),
  primary key (request_id, status)
);

alter table public.job_status_notifications enable row level security;

revoke all on table public.job_status_notifications from public;
grant all on table public.job_status_notifications to service_role;
