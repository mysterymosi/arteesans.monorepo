import { createClient } from "npm:@supabase/supabase-js@2";
import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import { buildRequestInterestReceivedPush } from "../_shared/notifications.ts";
import { createServiceSupabase, sendPushToUsers } from "../_shared/push.ts";

type NotifyRequestInterestBody = {
  request_id?: string;
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
    return jsonResponse({ error: "Missing Supabase environment variables" }, 500);
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

  let payload: NotifyRequestInterestBody;
  try {
    payload = (await req.json()) as NotifyRequestInterestBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const requestId = payload.request_id?.trim();
  if (!requestId) {
    return jsonResponse({ error: "request_id is required" }, 400);
  }

  const { data: request, error: requestError } = await authClient
    .from("service_requests")
    .select("id, customer_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    console.error("notify-request-interest request lookup failed:", requestError.message);
    return jsonResponse({ error: "Failed to verify request" }, 500);
  }

  if (!request || request.status !== "matching") {
    return jsonResponse({ error: "Request not found" }, 404);
  }

  const { data: interest, error: interestError } = await authClient
    .from("request_artisan_interests")
    .select("id")
    .eq("request_id", requestId)
    .eq("artisan_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (interestError) {
    console.error("notify-request-interest interest lookup failed:", interestError.message);
    return jsonResponse({ error: "Failed to verify interest" }, 500);
  }

  if (!interest) {
    return jsonResponse({ error: "Interest not found" }, 404);
  }

  try {
    const service = createServiceSupabase();
    const push = buildRequestInterestReceivedPush(requestId);
    const result = await sendPushToUsers(service, {
      user_ids: [request.customer_id],
      ...push,
    });

    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    console.error(
      "notify-request-interest push failed:",
      error instanceof Error ? error.message : error,
    );
    return jsonResponse({ error: "Failed to send push notification" }, 500);
  }
});
