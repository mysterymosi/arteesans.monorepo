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

export function isAwaitingCustomerConfirmation(
  request: Pick<CustomerServiceRequest, "status" | "customer_confirmed_at">,
): boolean {
  return request.status === "completed" && !request.customer_confirmed_at;
}

export function isActiveRequestStatus(
  status: RequestStatus,
  customerConfirmedAt?: string | null,
): boolean {
  if (status === "completed" && !customerConfirmedAt) {
    return true;
  }
  return ACTIVE_REQUEST_STATUSES.includes(status);
}

export function isFullyCompletedRequest(
  request: Pick<CustomerServiceRequest, "status" | "customer_confirmed_at">,
): boolean {
  if (request.status === "completed") {
    return Boolean(request.customer_confirmed_at);
  }
  return COMPLETED_REQUEST_STATUSES.includes(request.status);
}

export function filterRequestsByTab(
  requests: CustomerServiceRequest[],
  tab: "all" | "active" | "completed",
): CustomerServiceRequest[] {
  if (tab === "active") {
    return requests.filter((request) =>
      isActiveRequestStatus(request.status, request.customer_confirmed_at),
    );
  }
  if (tab === "completed") {
    return requests.filter((request) => isFullyCompletedRequest(request));
  }
  return requests;
}

export function getUrgencyTone(urgency: UrgencyLevel): "danger" | "warning" | "primary" | "neutral" {
  if (urgency === "emergency") return "danger";
  if (urgency === "urgent") return "warning";
  if (urgency === "normal") return "primary";
  return "neutral";
}
