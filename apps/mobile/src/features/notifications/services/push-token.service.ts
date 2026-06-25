import { Platform } from "react-native";
import * as Device from "expo-device";
import { supabase } from "@/lib/supabase";
import { registerForPushNotifications } from "@/lib/notifications";

export async function upsertPushToken(userId: string, token: string): Promise<void> {
  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: userId,
      expo_push_token: token,
      platform: Platform.OS,
      device_name: Device.deviceName ?? null,
    },
    { onConflict: "user_id,expo_push_token" },
  );

  if (error) {
    throw error;
  }
}

export async function syncPushTokenForUser(userId: string): Promise<void> {
  const token = await registerForPushNotifications();
  if (!token) return;

  await upsertPushToken(userId, token);
}

export async function notifyRequestCreated(requestId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("notify-request-created", {
    body: { request_id: requestId },
  });

  if (error) {
    console.warn("notify-request-created failed:", error.message);
  }
}

export async function notifyArtisanApplication(profileId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("notify-artisan-application", {
    body: { profile_id: profileId },
  });

  if (error) {
    console.warn("notify-artisan-application failed:", error.message);
  }
}
