import type { SendPushInput } from "@arteesans/shared";
import { createServiceClient } from "@/lib/supabase/server";

/** Fire-and-forget push dispatch via the send-push Edge Function. */
export async function sendPushNotification(input: SendPushInput): Promise<void> {
  try {
    const service = createServiceClient();
    const { error } = await service.functions.invoke("send-push", {
      body: input,
    });

    if (error) {
      console.error("send-push failed:", error.message);
    }
  } catch (error) {
    console.error(
      "send-push failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

export async function sendPushNotifications(inputs: SendPushInput[]): Promise<void> {
  await Promise.all(inputs.map((input) => sendPushNotification(input)));
}
