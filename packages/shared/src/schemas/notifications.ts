import { z } from "zod";

export const pushNotificationTypes = [
  "request_received",
  "matching_started",
  "artisan_matched",
  "artisan_application",
  "verification_approved",
  "verification_rejected",
] as const;

export type PushNotificationType = (typeof pushNotificationTypes)[number];

export const pushNotificationDataSchema = z.object({
  type: z.enum(pushNotificationTypes),
  entity_id: z.string().uuid().optional(),
});

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
    body: "You've been matched to a new service request.",
    data: { type: "artisan_matched", entity_id: requestId },
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
