import type { RequestStatus, UrgencyLevel } from "@arteesans/shared";
import type { Tables } from "@arteesans/supabase";

export type ServiceCategory = Pick<Tables<"service_categories">, "id" | "name" | "slug">;

export type JobCustomer = Pick<
  Tables<"users">,
  "id" | "first_name" | "last_name" | "profile_photo_url" | "phone"
>;

export type ArtisanJob = Tables<"service_requests"> & {
  category: ServiceCategory | null;
  customer: JobCustomer | null;
};

export function isIncomingAcceptanceJob(job: ArtisanJob): boolean {
  return job.status === "confirmed";
}

export function isActiveArtisanJob(job: ArtisanJob): boolean {
  return [
    "matched",
    "confirmed",
    "accepted",
    "on_the_way",
    "arrived",
    "in_progress",
  ].includes(job.status);
}

export function getUrgencyLabel(urgency: UrgencyLevel): string {
  if (urgency === "emergency") return "Emergency";
  if (urgency === "urgent") return "Urgent";
  if (urgency === "normal") return "Normal";
  return "Flexible";
}

export function getArtisanJobStatusLabel(status: RequestStatus): string {
  if (status === "confirmed") return "Awaiting acceptance";
  if (status === "on_the_way") return "On the way";
  if (status === "in_progress") return "In process";
  if (status === "completed") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  if (status === "matched") return "Pending confirmation";
  return status.replaceAll("_", " ");
}
