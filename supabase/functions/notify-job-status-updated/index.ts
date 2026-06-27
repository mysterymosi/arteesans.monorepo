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

const NO_OP_RESULT = { ok: true, sent: 0, removed: 0, failed: 0, failures: [] };

type NotifyJobStatusBody = {
  request_id?: string;
  status?: string;
};

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

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
  const status = payload.status?.trim();
  if (!requestId) {
    return jsonResponse({ error: "request_id is required" }, 400);
  }
  if (!status) {
    return jsonResponse({ error: "status is required" }, 400);
  }
  if (!CUSTOMER_NOTIFY_STATUSES.has(status)) {
    return jsonResponse({ error: "status is not notifiable" }, 400);
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

  if (request.status !== status) {
    return jsonResponse(NO_OP_RESULT);
  }

  try {
    const service = createServiceSupabase();

    const { data: existing, error: existingError } = await service
      .from("job_status_notifications")
      .select("request_id")
      .eq("request_id", requestId)
      .eq("status", status)
      .maybeSingle();

    if (existingError) {
      console.error("notify-job-status-updated lookup failed:", existingError.message);
      return jsonResponse({ error: "Failed to verify notification" }, 500);
    }

    if (existing) {
      return jsonResponse(NO_OP_RESULT);
    }

    const push = buildJobStatusUpdatedPush(requestId, status);
    const result = await sendPushToUsers(service, {
      user_ids: [request.customer_id],
      ...push,
    });

    const { error: recordError } = await service
      .from("job_status_notifications")
      .insert({ request_id: requestId, status });

    if (recordError) {
      if (isUniqueViolation(recordError)) {
        return jsonResponse({ ok: true, ...result });
      }
      console.error("notify-job-status-updated record failed:", recordError.message);
      return jsonResponse({ error: "Failed to record notification" }, 500);
    }

    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    console.error(
      "notify-job-status-updated push failed:",
      error instanceof Error ? error.message : error,
    );
    return jsonResponse({ error: "Failed to send push notification" }, 500);
  }
});
