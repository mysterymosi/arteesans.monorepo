import { createClient } from "npm:@supabase/supabase-js@2";
import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import { buildArtisanApplicationPush } from "../_shared/notifications.ts";
import {
  createServiceSupabase,
  fetchActiveAdminUserIds,
  sendPushToUsers,
} from "../_shared/push.ts";

type NotifyApplicationBody = {
  profile_id?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return corsPreflightResponse();
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(
      { error: "Missing Supabase environment variables" },
      500,
    );
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let payload: NotifyApplicationBody;
  try {
    payload = (await req.json()) as NotifyApplicationBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const profileId = payload.profile_id?.trim();
  if (!profileId) {
    return jsonResponse({ error: "profile_id is required" }, 400);
  }

  const { data: profile, error: profileError } = await authClient
    .from("artisan_profiles")
    .select("id, user_id, verification_status")
    .eq("id", profileId)
    .maybeSingle();

  if (profileError) {
    return jsonResponse({ error: profileError.message }, 500);
  }

  if (
    !profile ||
    profile.user_id !== user.id ||
    profile.verification_status !== "pending"
  ) {
    return jsonResponse({ error: "Application not found" }, 404);
  }

  try {
    const service = createServiceSupabase();
    const adminIds = await fetchActiveAdminUserIds(service);
    if (adminIds.length === 0) {
      return jsonResponse({ ok: true, sent: 0, removed: 0 });
    }

    const push = buildArtisanApplicationPush(profileId);
    const result = await sendPushToUsers(service, {
      user_ids: adminIds,
      ...push,
    });

    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send push notification";
    return jsonResponse({ error: message }, 500);
  }
});
