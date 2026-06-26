import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import {
  buildJobReassignedPush,
  buildJobStatusUpdatedPush,
} from "../_shared/notifications.ts";
import { createServiceSupabase, sendPushToUsers } from "../_shared/push.ts";

type ExpiredJobRow = {
  request_id: string;
  customer_id: string;
  previous_artisan_id: string | null;
};

const CRON_SECRET = Deno.env.get("CRON_SECRET");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return corsPreflightResponse();
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const cronSecret = req.headers.get("x-cron-secret");
  if (!CRON_SECRET || cronSecret !== CRON_SECRET) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    const service = createServiceSupabase();
    const { data, error } = await service.rpc("expire_stale_job_acceptances");

    if (error) {
      console.error("expire-job-acceptances rpc failed:", error.message);
      return jsonResponse({ error: "Failed to expire stale acceptances" }, 500);
    }

    const expired = (data ?? []) as ExpiredJobRow[];
    const adminIds = await fetchAdminUserIds(service);

    for (const row of expired) {
      const requestId = row.request_id;

      if (row.customer_id) {
        await sendPushToUsers(service, {
          user_ids: [row.customer_id],
          ...buildJobStatusUpdatedPush(requestId, "matching"),
        });
      }

      if (row.previous_artisan_id) {
        await sendPushToUsers(service, {
          user_ids: [row.previous_artisan_id],
          ...buildJobStatusUpdatedPush(requestId, "matching"),
        });
      }

      if (adminIds.length > 0) {
        await sendPushToUsers(service, {
          user_ids: adminIds,
          ...buildJobReassignedPush(requestId),
        });
      }
    }

    return jsonResponse({ ok: true, expired: expired.length });
  } catch (error) {
    console.error(
      "expire-job-acceptances failed:",
      error instanceof Error ? error.message : error,
    );
    return jsonResponse({ error: "Failed to process expirations" }, 500);
  }
});

async function fetchAdminUserIds(
  service: ReturnType<typeof createServiceSupabase>,
): Promise<string[]> {
  const { data, error } = await service
    .from("users")
    .select("id")
    .eq("role", "admin");

  if (error) {
    console.error("expire-job-acceptances admin lookup failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.id);
}
