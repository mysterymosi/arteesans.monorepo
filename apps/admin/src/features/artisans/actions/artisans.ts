"use server";

import { after } from "next/server";
import {
  rejectArtisanSchema,
  requestMoreInfoSchema,
  buildVerificationApprovedPush,
  buildVerificationRejectedPush,
  type ActionState,
  type RejectArtisanInput,
  type RequestMoreInfoInput,
} from "@arteesans/shared";
import { logAdminAction } from "@/features/audit";
import { sendPushNotification } from "@/lib/push/send-push";
import { updateArtisanVerificationStatus } from "@/features/artisans/services/artisans.service";

async function logArtisanDecision(input: {
  actionType: string;
  profileId: string;
  userId: string;
  previousStatus: string;
  reason?: string;
  note?: string;
}) {
  const { actionType, profileId, ...metadata } = input;
  await logAdminAction({
    actionType,
    entityType: "artisan_profile",
    entityId: profileId,
    metadata,
  });
}

export async function approveArtisan(userId: string): Promise<ActionState> {
  if (!userId) {
    return { error: "Invalid input" };
  }

  const result = await updateArtisanVerificationStatus(userId, "approved");
  if ("error" in result) {
    return { error: result.error };
  }

  await logArtisanDecision({
    actionType: "approve",
    profileId: result.profileId,
    userId,
    previousStatus: result.previousStatus,
  });

  after(async () => {
    await sendPushNotification({
      user_ids: [userId],
      ...buildVerificationApprovedPush(),
    });
  });

  return {};
}

export async function rejectArtisan(
  input: RejectArtisanInput,
): Promise<ActionState> {
  const parsed = rejectArtisanSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await updateArtisanVerificationStatus(parsed.data.userId, "rejected");
  if ("error" in result) {
    return { error: result.error };
  }

  await logArtisanDecision({
    actionType: "reject",
    profileId: result.profileId,
    userId: parsed.data.userId,
    previousStatus: result.previousStatus,
    reason: parsed.data.reason,
  });

  after(async () => {
    await sendPushNotification({
      user_ids: [parsed.data.userId],
      ...buildVerificationRejectedPush(),
    });
  });

  return {};
}

export async function requestMoreInfo(
  input: RequestMoreInfoInput,
): Promise<ActionState> {
  const parsed = requestMoreInfoSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await updateArtisanVerificationStatus(parsed.data.userId, "more_info");
  if ("error" in result) {
    return { error: result.error };
  }

  await logArtisanDecision({
    actionType: "request_more_info",
    profileId: result.profileId,
    userId: parsed.data.userId,
    previousStatus: result.previousStatus,
    note: parsed.data.note,
  });
  return {};
}
