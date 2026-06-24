"use server";

import { z } from "zod";
import type { ActionState } from "@arteesans/shared";
import { logAdminAction } from "@/features/audit";
import { assignArtisanToRequest } from "@/features/matching/services/matching.service";

const assignArtisanSchema = z.object({
  requestId: z.string().uuid(),
  artisanId: z.string().uuid(),
});

export async function assignArtisan(input: {
  requestId: string;
  artisanId: string;
}): Promise<ActionState> {
  const parsed = assignArtisanSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await assignArtisanToRequest(parsed.data);
  if ("error" in result) {
    return { error: result.error };
  }

  await logAdminAction({
    actionType: "assign",
    entityType: "service_request",
    entityId: result.requestId,
    metadata: {
      artisanId: result.artisanId,
      previousStatus: result.previousStatus,
      nextStatus: "matched",
    },
  });

  return { success: "Artisan assigned" };
}
