import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import {
  buildArtisanSelectedPush,
  buildRequestInterestReceivedPush,
} from "./notifications.ts";
import { sendPushToUsers } from "./push.ts";

const NO_OP_RESULT = { ok: true, sent: 0, removed: 0, failed: 0, failures: [] };

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

function isPushDispatchSuccessful(result: {
  sent: number;
  failed: number;
}): boolean {
  return result.sent > 0;
}

export async function dispatchRequestInterestNotification(
  service: SupabaseClient,
  requestId: string,
  artisanId: string,
) {
  const { data: request, error: requestError } = await service
    .from("service_requests")
    .select("id, customer_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    throw new Error(requestError.message);
  }

  if (!request || request.status !== "matching") {
    return NO_OP_RESULT;
  }

  const { data: interest, error: interestError } = await service
    .from("request_artisan_interests")
    .select("id")
    .eq("request_id", requestId)
    .eq("artisan_id", artisanId)
    .eq("status", "pending")
    .maybeSingle();

  if (interestError) {
    throw new Error(interestError.message);
  }

  if (!interest) {
    return NO_OP_RESULT;
  }

  const { data: existing, error: existingError } = await service
    .from("request_interest_notifications")
    .select("request_id")
    .eq("request_id", requestId)
    .eq("artisan_id", artisanId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    return NO_OP_RESULT;
  }

  const push = buildRequestInterestReceivedPush(requestId);
  const result = await sendPushToUsers(service, {
    user_ids: [request.customer_id],
    ...push,
  });

  if (isPushDispatchSuccessful(result)) {
    const { error: recordError } = await service
      .from("request_interest_notifications")
      .insert({ request_id: requestId, artisan_id: artisanId });

    if (recordError && !isUniqueViolation(recordError)) {
      throw new Error(recordError.message);
    }
  }

  return { ok: true, ...result };
}

export async function dispatchArtisanSelectedNotification(
  service: SupabaseClient,
  requestId: string,
  artisanId: string,
) {
  const { data: request, error: requestError } = await service
    .from("service_requests")
    .select("id, assigned_artisan_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    throw new Error(requestError.message);
  }

  if (
    !request ||
    request.status !== "accepted" ||
    request.assigned_artisan_id !== artisanId
  ) {
    return NO_OP_RESULT;
  }

  const { data: existing, error: existingError } = await service
    .from("artisan_selected_notifications")
    .select("request_id")
    .eq("request_id", requestId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    return NO_OP_RESULT;
  }

  const push = buildArtisanSelectedPush(requestId);
  const result = await sendPushToUsers(service, {
    user_ids: [artisanId],
    ...push,
  });

  if (isPushDispatchSuccessful(result)) {
    const { error: recordError } = await service
      .from("artisan_selected_notifications")
      .insert({ request_id: requestId, artisan_id: artisanId });

    if (recordError && !isUniqueViolation(recordError)) {
      throw new Error(recordError.message);
    }
  }

  return { ok: true, ...result };
}
