-- Idempotent admin push when an artisan submits their application.

alter table public.artisan_profiles
  add column application_notified_at timestamptz;
