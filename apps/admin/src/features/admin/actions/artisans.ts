"use server";

import {
  rejectArtisanSchema,
  requestMoreInfoSchema,
  type ActionState,
} from "@arteesans/shared";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/features/admin/services/audit.service";
import { updateArtisanVerificationStatus } from "@/features/admin/services/artisans.service";

function revalidateArtisanApplications() {
  revalidatePath("/artisans/applications");
  revalidatePath("/");
}

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

export async function approveArtisan(formData: FormData): Promise<void> {
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) {
    return;
  }

  const result = await updateArtisanVerificationStatus(userId, "approved");
  if ("error" in result) {
    return;
  }

  await logArtisanDecision({
    actionType: "approve",
    profileId: result.profileId,
    userId,
    previousStatus: result.previousStatus,
  });
  revalidateArtisanApplications();
}

export async function rejectArtisan(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = rejectArtisanSchema.safeParse({
    userId: formData.get("userId"),
    reason: formData.get("reason"),
  });

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
  revalidateArtisanApplications();
  return {};
}

export async function requestMoreInfo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = requestMoreInfoSchema.safeParse({
    userId: formData.get("userId"),
    note: formData.get("note"),
  });

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
  revalidateArtisanApplications();
  return {};
}
