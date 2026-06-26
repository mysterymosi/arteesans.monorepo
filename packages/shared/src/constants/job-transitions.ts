import type { RequestStatus } from "./status";

/** Artisan-driven forward transitions after acceptance. */
export const ARTISAN_JOB_TRANSITIONS: Partial<Record<RequestStatus, RequestStatus>> = {
  accepted: "on_the_way",
  on_the_way: "arrived",
  arrived: "in_progress",
  in_progress: "completed",
};

export const ARTISAN_JOB_STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  matching: "Matching",
  matched: "Matched",
  confirmed: "Awaiting acceptance",
  accepted: "Accepted",
  on_the_way: "On the way",
  arrived: "Arrived",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export const ARTISAN_ACTIVE_JOB_STATUSES: RequestStatus[] = [
  "matched",
  "confirmed",
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
];

export function getNextArtisanJobStatus(
  status: RequestStatus,
): RequestStatus | null {
  return ARTISAN_JOB_TRANSITIONS[status] ?? null;
}

export const JOB_ACCEPT_TIMEOUT_MINUTES = 15;
