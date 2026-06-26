import { supabase } from "@/lib/supabase";
import type { RequestStatus } from "@arteesans/shared";
import type { ArtisanJob } from "@/features/artisan-jobs/types/artisan-job";

const JOB_SELECT = `
  *,
  category:service_categories(id, name, slug),
  customer:users!service_requests_customer_id_fkey(id, first_name, last_name, profile_photo_url, phone)
`;

export async function fetchArtisanJobs(): Promise<ArtisanJob[]> {
  const { data, error } = await supabase
    .from("service_requests")
    .select(JOB_SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ArtisanJob[];
}

export async function fetchArtisanJob(requestId: string): Promise<ArtisanJob | null> {
  const { data, error } = await supabase
    .from("service_requests")
    .select(JOB_SELECT)
    .eq("id", requestId)
    .maybeSingle();

  if (error) throw error;
  return (data as ArtisanJob | null) ?? null;
}

export async function acceptJob(requestId: string): Promise<RequestStatus> {
  const { data, error } = await supabase.rpc("accept_job" as never, {
    p_request_id: requestId,
  } as never);

  if (error) throw error;
  return data as RequestStatus;
}

export async function rejectJob(requestId: string, reason?: string): Promise<RequestStatus> {
  const { data, error } = await supabase.rpc("reject_job" as never, {
    p_request_id: requestId,
    p_reason: reason ?? null,
  } as never);

  if (error) throw error;
  return data as RequestStatus;
}

export async function updateJobStatus(
  requestId: string,
  newStatus: RequestStatus,
): Promise<RequestStatus> {
  const { data, error } = await supabase.rpc("update_job_status" as never, {
    p_request_id: requestId,
    p_new_status: newStatus,
  } as never);

  if (error) throw error;
  return data as RequestStatus;
}

export async function attachCompletionMedia(
  requestId: string,
  paths: string[],
): Promise<string[]> {
  const { data, error } = await supabase.rpc("attach_completion_media" as never, {
    p_request_id: requestId,
    p_paths: paths,
  } as never);

  if (error) throw error;
  return data as string[];
}
