-- Phase 2.1: Artisan job management — RPCs, completion media, accept timeout

alter table public.service_requests
  add column if not exists completion_media_paths text[] not null default '{}',
  add column if not exists accept_deadline_at timestamptz,
  add column if not exists reject_reason text;

alter table public.admin_actions
  alter column admin_id drop not null;

alter table public.admin_actions
  add column if not exists actor_id uuid references public.users (id) on delete set null;

alter table public.admin_actions
  drop constraint if exists admin_actions_actor_present_chk;

alter table public.admin_actions
  add constraint admin_actions_actor_present_chk
  check (admin_id is not null or actor_id is not null);

-- Artisans can read customer profile on assigned jobs
create policy users_select_assigned_customer on public.users
  for select to authenticated
  using (
    role = 'customer'
    and exists (
      select 1
      from public.service_requests sr
      where sr.customer_id = users.id
        and sr.assigned_artisan_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Completion media storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('completion-media', 'completion-media', false, 524288)
on conflict (id) do nothing;

create policy completion_media_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'completion-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy completion_media_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'completion-media'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.service_requests sr
        where sr.id::text = (storage.foldername(name))[2]
          and (
            sr.customer_id = auth.uid()
            or sr.assigned_artisan_id = auth.uid()
          )
      )
    )
  );

-- ---------------------------------------------------------------------------
-- Accept deadline when customer confirms booking (Phase 2.2 sets confirmed)
-- ---------------------------------------------------------------------------
create or replace function public.set_accept_deadline_on_confirmed()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    new.accept_deadline_at := now() + interval '15 minutes';
    new.reject_reason := null;
  end if;

  return new;
end;
$$;

drop trigger if exists service_requests_accept_deadline on public.service_requests;

create trigger service_requests_accept_deadline
  before update on public.service_requests
  for each row
  execute function public.set_accept_deadline_on_confirmed();

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_valid_artisan_job_transition(
  p_from public.request_status,
  p_to public.request_status
)
returns boolean
language sql
immutable
as $$
  select case
    when p_from = 'accepted' and p_to = 'on_the_way' then true
    when p_from = 'on_the_way' and p_to = 'arrived' then true
    when p_from = 'arrived' and p_to = 'in_progress' then true
    when p_from = 'in_progress' and p_to = 'completed' then true
    else false
  end;
$$;

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

  if v_request.status not in ('confirmed', 'matched') then
    raise exception 'Request cannot be reopened from status %', v_request.status;
  end if;

  update public.service_requests
  set
    status = 'matching',
    assigned_artisan_id = null,
    accept_deadline_at = null,
    reject_reason = p_reason,
    updated_at = now()
  where id = p_request_id;

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

create or replace function public.assert_assigned_artisan_job(
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
  if not public.is_approved_artisan() then
    raise exception 'Only approved artisans can manage jobs';
  end if;

  select *
  into v_request
  from public.service_requests
  where id = p_request_id
    and assigned_artisan_id = auth.uid()
  for update;

  if not found then
    raise exception 'Job not found or not assigned to you';
  end if;

  if p_expected_status is not null and v_request.status is distinct from p_expected_status then
    raise exception 'Job must be in % status', p_expected_status;
  end if;

  return v_request;
end;
$$;

-- ---------------------------------------------------------------------------
-- Artisan job RPCs
-- ---------------------------------------------------------------------------
create or replace function public.accept_job(p_request_id uuid)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
begin
  v_request := public.assert_assigned_artisan_job(p_request_id, 'confirmed');

  if v_request.accept_deadline_at is not null and v_request.accept_deadline_at < now() then
    raise exception 'Acceptance window has expired';
  end if;

  update public.service_requests
  set
    status = 'accepted',
    accept_deadline_at = null,
    updated_at = now()
  where id = p_request_id;

  return 'accepted';
end;
$$;

create or replace function public.reject_job(
  p_request_id uuid,
  p_reason text default null
)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_assigned_artisan_job(p_request_id, 'confirmed');

  perform public.reopen_request_for_matching(
    p_request_id,
    coalesce(nullif(trim(p_reason), ''), 'Artisan rejected the job'),
    auth.uid(),
    'artisan_reject'
  );

  return 'matching';
end;
$$;

create or replace function public.update_job_status(
  p_request_id uuid,
  p_new_status public.request_status
)
returns public.request_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
begin
  v_request := public.assert_assigned_artisan_job(p_request_id);

  if not public.is_valid_artisan_job_transition(v_request.status, p_new_status) then
    raise exception 'Invalid status transition from % to %', v_request.status, p_new_status;
  end if;

  update public.service_requests
  set
    status = p_new_status,
    updated_at = now()
  where id = p_request_id;

  return p_new_status;
end;
$$;

create or replace function public.attach_completion_media(
  p_request_id uuid,
  p_paths text[]
)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.service_requests;
  v_paths text[];
begin
  v_request := public.assert_assigned_artisan_job(p_request_id, 'completed');

  v_paths := coalesce(v_request.completion_media_paths, '{}') || coalesce(p_paths, '{}');

  if cardinality(v_paths) > 3 then
    raise exception 'At most 3 completion photos are allowed';
  end if;

  update public.service_requests
  set
    completion_media_paths = v_paths,
    updated_at = now()
  where id = p_request_id;

  return v_paths;
end;
$$;

create or replace function public.expire_stale_job_acceptances()
returns table (
  request_id uuid,
  customer_id uuid,
  previous_artisan_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row record;
begin
  for v_row in
    select id, customer_id, assigned_artisan_id
    from public.service_requests
    where status = 'confirmed'
      and accept_deadline_at is not null
      and accept_deadline_at < now()
    for update skip locked
  loop
    perform public.reopen_request_for_matching(
      v_row.id,
      'Acceptance window expired',
      v_row.assigned_artisan_id,
      'accept_timeout'
    );

    request_id := v_row.id;
    customer_id := v_row.customer_id;
    previous_artisan_id := v_row.assigned_artisan_id;
    return next;
  end loop;
end;
$$;

grant execute on function public.accept_job(uuid) to authenticated;
grant execute on function public.reject_job(uuid, text) to authenticated;
grant execute on function public.update_job_status(uuid, public.request_status) to authenticated;
grant execute on function public.attach_completion_media(uuid, text[]) to authenticated;
grant execute on function public.expire_stale_job_acceptances() to service_role;

-- Realtime updates for assigned artisan job status
alter publication supabase_realtime add table public.service_requests;
