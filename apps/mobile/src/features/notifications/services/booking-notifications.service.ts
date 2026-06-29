import { supabase } from "@/lib/supabase";
import type { RequestStatus } from "@arteesans/shared";

export async function notifyBookingConfirmed(requestId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("notify-booking-confirmed", {
    body: { request_id: requestId },
  });

  if (error) {
    console.warn("notify-booking-confirmed failed:", error.message);
  }
}

export async function notifyJobStatusUpdated(
  requestId: string,
  status: RequestStatus,
): Promise<void> {
  const { error } = await supabase.functions.invoke("notify-job-status-updated", {
    body: { request_id: requestId, status },
  });

  if (error) {
    console.warn("notify-job-status-updated failed:", error.message);
  }
}

export async function notifyRequestInterest(requestId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("notify-request-interest", {
    body: { request_id: requestId },
  });

  if (error) {
    console.warn("notify-request-interest failed:", error.message);
  }
}

export async function notifyArtisanSelected(requestId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("notify-artisan-selected", {
    body: { request_id: requestId },
  });

  if (error) {
    console.warn("notify-artisan-selected failed:", error.message);
  }
}
