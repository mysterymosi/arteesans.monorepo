import type { UrgencyLevel } from "@arteesans/shared";
import { supabase } from "@/lib/supabase";
import { notifyRequestCreated } from "@/features/notifications";
import { uploadRequestPhotos } from "@/features/service-requests/services/request-media.service";

export type CreateServiceRequestInput = {
  categoryId: string;
  description: string;
  urgency: UrgencyLevel;
  address: string;
  latitude: number;
  longitude: number;
  preferredTime?: Date;
  budget?: number;
  photoUris?: string[];
};

export async function createServiceRequest(
  userId: string,
  input: CreateServiceRequestInput,
): Promise<string> {
  const mediaPaths =
    input.photoUris && input.photoUris.length > 0
      ? await uploadRequestPhotos(userId, input.photoUris)
      : [];

  const { data, error } = await supabase.rpc("create_service_request" as never, {
    p_category_id: input.categoryId,
    p_description: input.description,
    p_urgency: input.urgency,
    p_address: input.address,
    p_latitude: input.latitude,
    p_longitude: input.longitude,
    p_preferred_time: input.preferredTime?.toISOString() ?? undefined,
    p_budget: input.budget ?? undefined,
    p_media_paths: mediaPaths,
  } as never);

  if (error) throw error;
  if (!data) throw new Error("Request could not be created.");

  const requestId = data as string;
  void notifyRequestCreated(requestId);

  return requestId;
}
