-- Atomic append for completion_media_paths (row already locked by assert_assigned_artisan_job).

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
  v_path text;
  v_seen_paths text[] := '{}';
begin
  -- Locks service_requests via SELECT ... FOR UPDATE inside assert_assigned_artisan_job.
  v_request := public.assert_assigned_artisan_job(p_request_id, 'completed');

  foreach v_path in array coalesce(p_paths, '{}')
  loop
    if v_path is null or btrim(v_path) = '' then
      raise exception 'Invalid completion media path';
    end if;

    if (storage.foldername(v_path))[1] is distinct from auth.uid()::text
       or (storage.foldername(v_path))[2] is distinct from p_request_id::text then
      raise exception 'Completion media path does not belong to this job';
    end if;

    if not exists (
      select 1
      from storage.objects obj
      where obj.bucket_id = 'completion-media'
        and obj.name = v_path
    ) then
      raise exception 'Completion media object not found';
    end if;

    if v_path = any(coalesce(v_request.completion_media_paths, '{}')) then
      raise exception 'Completion media path already attached';
    end if;

    if v_path = any(v_seen_paths) then
      raise exception 'Duplicate completion media path in request';
    end if;

    v_seen_paths := v_seen_paths || v_path;
  end loop;

  if cardinality(coalesce(v_request.completion_media_paths, '{}') || coalesce(p_paths, '{}')) > 3 then
    raise exception 'At most 3 completion photos are allowed';
  end if;

  update public.service_requests
  set
    completion_media_paths = completion_media_paths || coalesce(p_paths, '{}'),
    updated_at = now()
  where id = p_request_id
  returning completion_media_paths into v_paths;

  if not found then
    raise exception 'Job not found or not assigned to you';
  end if;

  return v_paths;
end;
$$;
