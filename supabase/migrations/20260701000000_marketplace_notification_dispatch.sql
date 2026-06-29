-- Dispatch marketplace push notifications from RPC mutations via pg_net.

create extension if not exists pg_net with schema extensions;

create table public.request_interest_notifications (
  request_id uuid not null references public.service_requests(id) on delete cascade,
  artisan_id uuid not null references public.users(id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (request_id, artisan_id)
);

create table public.artisan_selected_notifications (
  request_id uuid primary key references public.service_requests(id) on delete cascade,
  artisan_id uuid not null references public.users(id) on delete cascade,
  sent_at timestamptz not null default now()
);

alter table public.request_interest_notifications enable row level security;
alter table public.artisan_selected_notifications enable row level security;

revoke all on table public.request_interest_notifications from public;
revoke all on table public.artisan_selected_notifications from public;
grant all on table public.request_interest_notifications to service_role;
grant all on table public.artisan_selected_notifications to service_role;

create or replace function private.edge_function_url(p_name text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select
    rtrim(
      coalesce(
        nullif(current_setting('app.settings.supabase_url', true), ''),
        'http://kong:8000'
      ),
      '/'
    )
    || '/functions/v1/'
    || p_name;
$$;

create or replace function private.service_role_key()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select nullif(current_setting('app.settings.service_role_key', true), '');
$$;

create or replace function private.dispatch_edge_function(
  p_function_name text,
  p_body jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_key text;
begin
  v_key := private.service_role_key();

  if v_key is null then
    raise log 'dispatch_edge_function skipped (%): app.settings.service_role_key is not set',
      p_function_name;
    return null;
  end if;

  return net.http_post(
    url := private.edge_function_url(p_function_name),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_key
    ),
    body := p_body
  );
end;
$$;

revoke all on function private.edge_function_url(text) from public;
revoke all on function private.service_role_key() from public;
revoke all on function private.dispatch_edge_function(text, jsonb) from public;

-- Local Supabase default. Override on hosted projects (see docs/setup.md).
do $config$
begin
  execute format(
    'alter database %I set app.settings.supabase_url = %L',
    current_database(),
    'http://kong:8000'
  );
exception
  when insufficient_privilege then
    raise log 'Could not set app.settings.supabase_url on database %', current_database();
end
$config$;

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

  perform private.dispatch_edge_function(
    'notify-request-interest',
    jsonb_build_object(
      'request_id', p_request_id,
      'artisan_id', auth.uid()
    )
  );

  return v_status;
end;
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

  perform private.dispatch_edge_function(
    'notify-artisan-selected',
    jsonb_build_object(
      'request_id', p_request_id,
      'artisan_id', p_artisan_id
    )
  );

  return 'accepted';
end;
$$;
