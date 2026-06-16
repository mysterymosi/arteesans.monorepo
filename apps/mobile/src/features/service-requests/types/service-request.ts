import type { RequestStatus, UrgencyLevel } from "@arteesans/shared";
import type { Tables } from "@arteesans/supabase";

export type ServiceCategory = Tables<"service_categories">;

export type AssignedArtisan = Pick<
  Tables<"users">,
  "id" | "first_name" | "last_name" | "profile_photo_url"
>;

export type CustomerServiceRequest = Tables<"service_requests"> & {
  category: Pick<ServiceCategory, "id" | "name" | "slug"> | null;
  artisan: AssignedArtisan | null;
};

export const ACTIVE_REQUEST_STATUSES: RequestStatus[] = [
  "submitted",
  "matching",
  "matched",
  "confirmed",
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
];

export const COMPLETED_REQUEST_STATUSES: RequestStatus[] = ["completed", "cancelled", "disputed"];

export function isActiveRequestStatus(status: RequestStatus): boolean {
  return ACTIVE_REQUEST_STATUSES.includes(status);
}

export function filterRequestsByTab(
  requests: CustomerServiceRequest[],
  tab: "all" | "active" | "completed",
): CustomerServiceRequest[] {
  if (tab === "active") {
    return requests.filter((request) => isActiveRequestStatus(request.status));
  }
  if (tab === "completed") {
    return requests.filter((request) => COMPLETED_REQUEST_STATUSES.includes(request.status));
  }
  return requests;
}

export function getUrgencyTone(urgency: UrgencyLevel): "danger" | "warning" | "primary" | "neutral" {
  if (urgency === "emergency") return "danger";
  if (urgency === "urgent") return "warning";
  if (urgency === "normal") return "primary";
  return "neutral";
}
