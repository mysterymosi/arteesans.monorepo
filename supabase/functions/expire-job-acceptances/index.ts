import { corsPreflightResponse, jsonResponse } from "../_shared/http.ts";
import {
  buildJobReassignedPush,
  buildJobStatusUpdatedPush,
} from "../_shared/notifications.ts";
import { createServiceSupabase, fetchActiveAdminUserIds, sendPushToUsers } from "../_shared/push.ts";

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
    const adminIds = await fetchActiveAdminUserIds(service);

    const { data, error } = await service.rpc("expire_stale_job_acceptances");

    if (error) {
      console.error("expire-job-acceptances rpc failed:", error.message);
      return jsonResponse({ error: "Failed to expire stale acceptances" }, 500);
    }

    const expired = (data ?? []) as ExpiredJobRow[];

    for (const row of expired) {
      const requestId = row.request_id;

      if (row.customer_id) {
        try {
          await sendPushToUsers(service, {
            user_ids: [row.customer_id],
            ...buildJobStatusUpdatedPush(requestId, "matching"),
          });
        } catch (error) {
          console.error(
            `expire-job-acceptances customer push failed for ${requestId}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }

      if (row.previous_artisan_id) {
        try {
          await sendPushToUsers(service, {
            user_ids: [row.previous_artisan_id],
            ...buildJobStatusUpdatedPush(requestId, "matching"),
          });
        } catch (error) {
          console.error(
            `expire-job-acceptances artisan push failed for ${requestId}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }

      if (adminIds.length > 0) {
        try {
          await sendPushToUsers(service, {
            user_ids: adminIds,
            ...buildJobReassignedPush(requestId),
          });
        } catch (error) {
          console.error(
            `expire-job-acceptances admin push failed for ${requestId}:`,
            error instanceof Error ? error.message : error,
          );
        }
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
