import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import {
  createServiceSupabase,
  isServiceRoleRequest,
  sendPushToUsers,
} from "../_shared/push.ts";

type SendPushBody = {
  user_ids?: string[];
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return corsPreflightResponse();
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!isServiceRoleRequest(req)) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let payload: SendPushBody;
  try {
    payload = (await req.json()) as SendPushBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const userIds = payload.user_ids?.filter(Boolean) ?? [];
  const title = payload.title?.trim();
  const body = payload.body?.trim();

  if (userIds.length === 0 || !title || !body) {
    return jsonResponse({ error: "user_ids, title, and body are required" }, 400);
  }

  try {
    const supabase = createServiceSupabase();
    const result = await sendPushToUsers(supabase, {
      user_ids: userIds,
      title,
      body,
      data: payload.data,
    });

    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send push notifications";
    return jsonResponse({ error: message }, 500);
  }
});
