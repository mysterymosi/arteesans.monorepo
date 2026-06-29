import { supabase } from "@/lib/supabase";
import type { OpenRequest, RequestInterest } from "@/features/open-requests/types/open-request";
import { notifyJobStatusUpdated } from "@/features/notifications/services/booking-notifications.service";
import type { RequestStatus } from "@arteesans/shared";

export async function fetchOpenRequests(): Promise<OpenRequest[]> {
  const { data, error } = await supabase.rpc("list_open_requests_for_artisan" as never, {
    p_max_radius_meters: 50000,
  } as never);

  if (error) throw error;
  return (data ?? []) as OpenRequest[];
}

export async function expressInterest(requestId: string): Promise<void> {
  const { error } = await supabase.rpc("express_interest" as never, {
    p_request_id: requestId,
  } as never);

  if (error) throw error;
}

export async function withdrawInterest(requestId: string): Promise<void> {
  const { error } = await supabase.rpc("withdraw_interest" as never, {
    p_request_id: requestId,
  } as never);

  if (error) throw error;
}

export async function fetchRequestInterests(requestId: string): Promise<RequestInterest[]> {
  const { data, error } = await supabase.rpc("list_request_interests" as never, {
    p_request_id: requestId,
  } as never);

  if (error) throw error;
  return (data ?? []) as RequestInterest[];
}

export async function selectArtisan(
  requestId: string,
  artisanId: string,
): Promise<RequestStatus> {
  const { data, error } = await supabase.rpc("select_artisan" as never, {
    p_request_id: requestId,
    p_artisan_id: artisanId,
  } as never);

  if (error) throw error;
  return data as RequestStatus;
}

export async function declineSelectedJob(requestId: string, reason?: string): Promise<void> {
  const { error } = await supabase.rpc("decline_selected_job" as never, {
    p_request_id: requestId,
    p_reason: reason ?? null,
  } as never);

  if (error) throw error;
  void notifyJobStatusUpdated(requestId, "matching");
}
