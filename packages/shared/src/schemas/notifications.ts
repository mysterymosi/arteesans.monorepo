import { z } from "zod";
import { REQUEST_STATUSES, type RequestStatus } from "../constants/status";

export const pushNotificationTypes = [
  "request_received",
  "matching_started",
  "artisan_matched",
  "job_acceptance_required",
  "job_status_updated",
  "job_reassigned",
  "request_interest_received",
  "artisan_selected",
  "artisan_application",
  "verification_approved",
  "verification_rejected",
] as const;

export type PushNotificationType = (typeof pushNotificationTypes)[number];

export const pushNotificationDataSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("request_received"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("artisan_matched"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("job_acceptance_required"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("job_status_updated"),
    entity_id: z.string().uuid(),
    status: z.enum(REQUEST_STATUSES),
  }),
  z.object({
    type: z.literal("job_reassigned"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("request_interest_received"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("artisan_selected"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("artisan_application"),
    entity_id: z.string().uuid(),
  }),
  z.object({
    type: z.literal("matching_started"),
    entity_id: z.string().uuid().optional(),
  }),
  z.object({
    type: z.literal("verification_approved"),
    entity_id: z.string().uuid().optional(),
  }),
  z.object({
    type: z.literal("verification_rejected"),
    entity_id: z.string().uuid().optional(),
  }),
]);

export type PushNotificationData = z.infer<typeof pushNotificationDataSchema>;

export const sendPushInputSchema = z.object({
  user_ids: z.array(z.string().uuid()).min(1),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  data: pushNotificationDataSchema.optional(),
});

export type SendPushInput = z.infer<typeof sendPushInputSchema>;

export function buildRequestReceivedPush(requestId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Request received",
    body: "We're finding an artisan for your service request.",
    data: { type: "request_received", entity_id: requestId },
  };
}

export function buildArtisanMatchedCustomerPush(requestId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Artisan matched",
    body: "An artisan has been assigned to your request.",
    data: { type: "artisan_matched", entity_id: requestId },
  };
}

export function buildArtisanMatchedArtisanPush(requestId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "New job match",
    body: "You've been matched to a new service request. Review it when the customer confirms.",
    data: { type: "artisan_matched", entity_id: requestId },
  };
}

export function buildJobAcceptanceRequiredPush(requestId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Job ready to accept",
    body: "A customer confirmed your matched job. Accept or decline within 15 minutes.",
    data: { type: "job_acceptance_required", entity_id: requestId },
  };
}

export function buildJobStatusUpdatedPush(
  requestId: string,
  status: RequestStatus,
): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Job update",
    body: `Your job status is now ${status.replaceAll("_", " ")}.`,
    data: { type: "job_status_updated", entity_id: requestId, status },
  };
}

export function buildJobReassignedPush(requestId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Job needs rematch",
    body: "A service request was returned to matching and needs a new artisan.",
    data: { type: "job_reassigned", entity_id: requestId },
  };
}

export function buildRequestInterestReceivedPush(
  requestId: string,
): Omit<SendPushInput, "user_ids"> {
  return {
    title: "New artisan interest",
    body: "An artisan is interested in your service request. Review and choose your artisan.",
    data: { type: "request_interest_received", entity_id: requestId },
  };
}

export function buildArtisanSelectedPush(requestId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "You were selected",
    body: "A customer chose you for their job. Open the app to get started.",
    data: { type: "artisan_selected", entity_id: requestId },
  };
}

export function buildArtisanApplicationPush(profileId: string): Omit<SendPushInput, "user_ids"> {
  return {
    title: "New artisan application",
    body: "A new artisan application is ready for review.",
    data: { type: "artisan_application", entity_id: profileId },
  };
}

export function buildVerificationApprovedPush(): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Application approved",
    body: "Your artisan profile has been approved. You can start receiving jobs.",
    data: { type: "verification_approved" },
  };
}

export function buildVerificationRejectedPush(): Omit<SendPushInput, "user_ids"> {
  return {
    title: "Application update",
    body: "Your artisan application was not approved. Check the app for details.",
    data: { type: "verification_rejected" },
  };
}
