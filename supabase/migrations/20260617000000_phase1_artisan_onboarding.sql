-- Phase 1.4: artisan verification document storage

insert into storage.buckets (id, name, public, file_size_limit)
values ('verification-docs', 'verification-docs', false, 524288)
on conflict (id) do nothing;

drop policy if exists verification_docs_insert on storage.objects;
create policy verification_docs_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'verification-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists verification_docs_select on storage.objects;
create policy verification_docs_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'verification-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
