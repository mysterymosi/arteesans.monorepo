import type { MatchSuggestion } from "@arteesans/shared";
import {
  buildArtisanMatchedArtisanPush,
  buildArtisanMatchedCustomerPush,
} from "@arteesans/shared";
import { sendPushNotifications } from "@/lib/push/send-push";
import { createServiceClient } from "@/lib/supabase/server";

type AssignArtisanResult =
  | { error: string }
  | {
      requestId: string;
      artisanId: string;
      customerId: string;
      previousStatus: "matching";
    };

function toNumber(value: number | string | null): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value);
}

function toNullableNumber(value: number | string | null): number | null {
  if (value == null) return null;
  return typeof value === "number" ? value : Number(value);
}

export async function getMatchSuggestions(
  requestId: string,
): Promise<MatchSuggestion[]> {
  const service = createServiceClient();
  const { data, error } = await service.rpc("generate_match_suggestions", {
    p_request_id: requestId,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  return data.map((row) => ({
    artisanId: row.artisan_id,
    artisanProfileId: row.artisan_profile_id,
    artisanName: row.artisan_name,
    categoryName: row.category_name,
    cityLga: row.city_lga,
    state: row.state,
    availability: row.availability,
    averageRating: toNumber(row.average_rating),
    completedJobs: row.completed_jobs,
    distanceMeters: toNullableNumber(row.distance_meters),
    score: toNumber(row.score),
    breakdown: {
      category: toNumber(row.category_score),
      location: toNumber(row.location_score),
      availability: toNumber(row.availability_score),
      rating: toNumber(row.rating_score),
      completion: toNumber(row.completion_score),
      response: toNumber(row.response_score),
    },
  }));
}

export async function assignArtisanToRequest({
  requestId,
  artisanId,
}: {
  requestId: string;
  artisanId: string;
}): Promise<AssignArtisanResult> {
  const service = createServiceClient();

  const { data: request, error: requestError } = await service
    .from("service_requests")
    .select("id, status, customer_id")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError || !request) {
    return { error: requestError?.message ?? "Request not found" };
  }

  if (request.status !== "matching") {
    return { error: "Only matching requests can be assigned." };
  }

  const { data: artisan, error: artisanError } = await service
    .from("artisan_profiles")
    .select("id, user_id, verification_status")
    .eq("user_id", artisanId)
    .maybeSingle();

  if (artisanError || !artisan) {
    return { error: artisanError?.message ?? "Artisan profile not found" };
  }

  if (artisan.verification_status !== "approved") {
    return { error: "Only approved artisans can be assigned." };
  }

  const { data: updatedRequest, error: updateError } = await service
    .from("service_requests")
    .update({
      assigned_artisan_id: artisanId,
      status: "matched",
    })
    .eq("id", requestId)
    .eq("status", "matching")
    .select("id")
    .maybeSingle();

  if (updateError) {
    return { error: updateError.message };
  }

  if (!updatedRequest) {
    return { error: "Request is no longer available for matching." };
  }

  void sendPushNotifications([
    {
      user_ids: [request.customer_id],
      ...buildArtisanMatchedCustomerPush(requestId),
    },
    {
      user_ids: [artisanId],
      ...buildArtisanMatchedArtisanPush(requestId),
    },
  ]);

  return {
    requestId,
    artisanId,
    customerId: request.customer_id,
    previousStatus: "matching",
  };
}
