import { notifyBookingConfirmed } from "@/features/notifications/services/booking-notifications.service";
import { supabase } from "@/lib/supabase";
import type { RequestStatus } from "@arteesans/shared";

export async function confirmBooking(requestId: string): Promise<RequestStatus> {
  const { data, error } = await supabase.rpc("confirm_booking" as never, {
    p_request_id: requestId,
  } as never);

  if (error) throw error;

  void notifyBookingConfirmed(requestId);
  return data as RequestStatus;
}

export async function confirmJobCompletion(requestId: string): Promise<string> {
  const { data, error } = await supabase.rpc("confirm_job_completion" as never, {
    p_request_id: requestId,
  } as never);

  if (error) throw error;
  return data as string;
}
