-- Tighten completion-media uploads: path segment 2 must be an assigned job.

drop policy if exists completion_media_insert on storage.objects;

create policy completion_media_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'completion-media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.service_requests sr
      where sr.id::text = (storage.foldername(name))[2]
        and sr.assigned_artisan_id = auth.uid()
    )
  );
