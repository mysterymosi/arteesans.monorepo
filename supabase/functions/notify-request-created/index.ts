import { createClient } from "npm:@supabase/supabase-js@2";
import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import { buildRequestReceivedPush } from "../_shared/notifications.ts";
import { createServiceSupabase, sendPushToUsers } from "../_shared/push.ts";

type NotifyRequestBody = {
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

  let payload: NotifyRequestBody;
  try {
    payload = (await req.json()) as NotifyRequestBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const requestId = payload.request_id?.trim();
  if (!requestId) {
    return jsonResponse({ error: "request_id is required" }, 400);
  }

  const { data: request, error: requestError } = await authClient
    .from("service_requests")
    .select("id, customer_id")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    return jsonResponse({ error: requestError.message }, 500);
  }

  if (!request || request.customer_id !== user.id) {
    return jsonResponse({ error: "Request not found" }, 404);
  }

  try {
    const service = createServiceSupabase();
    const push = buildRequestReceivedPush(requestId);
    const result = await sendPushToUsers(service, {
      user_ids: [user.id],
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
