import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import { dispatchArtisanSelectedNotification } from "../_shared/marketplace-notifications.ts";
import { createServiceSupabase, isServiceRoleRequest } from "../_shared/push.ts";

type NotifyArtisanSelectedBody = {
  request_id?: string;
  artisan_id?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return corsPreflightResponse();
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!isServiceRoleRequest(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let payload: NotifyArtisanSelectedBody;
  try {
    payload = (await req.json()) as NotifyArtisanSelectedBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const requestId = payload.request_id?.trim();
  const artisanId = payload.artisan_id?.trim();
  if (!requestId) {
    return jsonResponse({ error: "request_id is required" }, 400);
  }
  if (!artisanId) {
    return jsonResponse({ error: "artisan_id is required" }, 400);
  }

  try {
    const service = createServiceSupabase();
    const result = await dispatchArtisanSelectedNotification(
      service,
      requestId,
      artisanId,
    );
    return jsonResponse(result);
  } catch (error) {
    console.error(
      "notify-artisan-selected push failed:",
      error instanceof Error ? error.message : error,
    );
    return jsonResponse({ error: "Failed to send push notification" }, 500);
  }
});
