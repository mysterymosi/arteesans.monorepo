import { createClient } from "npm:@supabase/supabase-js@2";
import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import { buildJobStatusUpdatedPush } from "../_shared/notifications.ts";
import { createServiceSupabase, sendPushToUsers } from "../_shared/push.ts";

const CUSTOMER_NOTIFY_STATUSES = new Set([
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "completed",
]);

type NotifyJobStatusBody = {
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

  let payload: NotifyJobStatusBody;
  try {
    payload = (await req.json()) as NotifyJobStatusBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const requestId = payload.request_id?.trim();
  if (!requestId) {
    return jsonResponse({ error: "request_id is required" }, 400);
  }

  const { data: request, error: requestError } = await authClient
    .from("service_requests")
    .select("id, customer_id, assigned_artisan_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    console.error("notify-job-status-updated request lookup failed:", requestError.message);
    return jsonResponse({ error: "Failed to verify job" }, 500);
  }

  if (!request || request.assigned_artisan_id !== user.id) {
    return jsonResponse({ error: "Job not found" }, 404);
  }

  if (!CUSTOMER_NOTIFY_STATUSES.has(request.status)) {
    return jsonResponse({ ok: true, sent: 0, removed: 0, failed: 0, failures: [] });
  }

  try {
    const service = createServiceSupabase();
    const push = buildJobStatusUpdatedPush(requestId, request.status);
    const result = await sendPushToUsers(service, {
      user_ids: [request.customer_id],
      ...push,
    });

    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    console.error(
      "notify-job-status-updated push failed:",
      error instanceof Error ? error.message : error,
    );
    return jsonResponse({ error: "Failed to send push notification" }, 500);
  }
});
