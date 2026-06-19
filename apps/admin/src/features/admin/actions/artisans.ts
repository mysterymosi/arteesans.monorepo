"use server";

import {
  rejectArtisanSchema,
  requestMoreInfoSchema,
  type ActionState,
} from "@arteesans/shared";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAction } from "./audit";

export async function approveArtisan(userId: string): Promise<ActionState> {
  const service = createServiceClient();

  const { data: profile, error: fetchError } = await service
    .from("artisan_profiles")
    .select("id, verification_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError || !profile) {
    return { error: fetchError?.message ?? "Artisan profile not found" };
  }

  const { error } = await service
    .from("artisan_profiles")
    .update({ verification_status: "approved" })
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction({
    actionType: "approve",
    entityType: "artisan_profile",
    entityId: profile.id,
    metadata: { userId, previousStatus: profile.verification_status },
  });

  revalidatePath("/artisans/applications");
  revalidatePath("/");
  return {};
}

export async function approveArtisanAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) {
    return;
  }
  await approveArtisan(userId);
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

  const service = createServiceClient();
  const { data: profile, error: fetchError } = await service
    .from("artisan_profiles")
    .select("id, verification_status")
    .eq("user_id", parsed.data.userId)
    .maybeSingle();

  if (fetchError || !profile) {
    return { error: fetchError?.message ?? "Artisan profile not found" };
  }

  const { error } = await service
    .from("artisan_profiles")
    .update({ verification_status: "rejected" })
    .eq("user_id", parsed.data.userId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction({
    actionType: "reject",
    entityType: "artisan_profile",
    entityId: profile.id,
    metadata: {
      userId: parsed.data.userId,
      reason: parsed.data.reason,
      previousStatus: profile.verification_status,
    },
  });

  revalidatePath("/artisans/applications");
  revalidatePath("/");
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

  const service = createServiceClient();
  const { data: profile, error: fetchError } = await service
    .from("artisan_profiles")
    .select("id, verification_status")
    .eq("user_id", parsed.data.userId)
    .maybeSingle();

  if (fetchError || !profile) {
    return { error: fetchError?.message ?? "Artisan profile not found" };
  }

  const { error } = await service
    .from("artisan_profiles")
    .update({ verification_status: "more_info" })
    .eq("user_id", parsed.data.userId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction({
    actionType: "request_more_info",
    entityType: "artisan_profile",
    entityId: profile.id,
    metadata: {
      userId: parsed.data.userId,
      note: parsed.data.note,
      previousStatus: profile.verification_status,
    },
  });

  revalidatePath("/artisans/applications");
  revalidatePath("/");
  return {};
}
