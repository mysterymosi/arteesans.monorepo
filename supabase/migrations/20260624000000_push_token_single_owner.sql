-- One Expo push token maps to one user (device handoff / account switch on same device).

delete from public.push_tokens
where id not in (
  select distinct on (expo_push_token) id
  from public.push_tokens
  order by expo_push_token, updated_at desc, id desc
);

alter table public.push_tokens
  drop constraint push_tokens_user_id_expo_push_token_key;

alter table public.push_tokens
  add constraint push_tokens_expo_push_token_key unique (expo_push_token);

create or replace function public.register_push_token(
  p_expo_push_token text,
  p_platform text default null,
  p_device_name text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.push_tokens (user_id, expo_push_token, platform, device_name)
  values (v_user_id, p_expo_push_token, p_platform, p_device_name)
  on conflict (expo_push_token) do update
  set
    user_id = excluded.user_id,
    platform = excluded.platform,
    device_name = excluded.device_name,
    updated_at = now();
end;
$$;

revoke all on function public.register_push_token(text, text, text) from public;
grant execute on function public.register_push_token(text, text, text) to authenticated;
