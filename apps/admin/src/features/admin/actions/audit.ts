"use server";

import type { Database } from "@arteesans/supabase";
import { createAuthClient, createServiceClient } from "@/lib/supabase/server";

type Json = Database["public"]["Tables"]["admin_actions"]["Insert"]["metadata"];

export async function logAdminAction(input: {
  actionType: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const service = createServiceClient();
  const { error } = await service.from("admin_actions").insert({
    admin_id: user.id,
    action_type: input.actionType,
    entity_type: input.entityType,
    entity_id: input.entityId,
    metadata: (input.metadata ?? {}) as Json,
  });

  if (error) {
    throw new Error(error.message);
  }
}
