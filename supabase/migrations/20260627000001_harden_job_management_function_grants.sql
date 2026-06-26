-- Lock down internal job-management helpers: revoke default PUBLIC execute.

revoke all on function public.reopen_request_for_matching(uuid, text, uuid, text) from public;

revoke all on function public.expire_stale_job_acceptances() from public;
grant execute on function public.expire_stale_job_acceptances() to service_role;
