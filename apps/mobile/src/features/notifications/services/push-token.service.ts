import { Platform } from "react-native";
import * as Device from "expo-device";
import { supabase } from "@/lib/supabase";
import { registerForPushNotifications } from "@/lib/notifications";

export async function upsertPushToken(token: string): Promise<void> {
  const { error } = await supabase.rpc("register_push_token" as never, {
    p_expo_push_token: token,
    p_platform: Platform.OS,
    p_device_name: Device.deviceName ?? null,
  } as never);

  if (error) {
    throw error;
  }
}

export async function syncPushTokenForUser(userId: string): Promise<void> {
  const token = await registerForPushNotifications();
  if (!token) return;

  await upsertPushToken(token);
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
