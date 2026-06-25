import type { ArtisanGuarantorsInput, Availability } from "@arteesans/shared";
import { supabase } from "@/lib/supabase";
import { notifyArtisanApplication } from "@/features/notifications";
import { fetchServiceCategories } from "@/features/service-requests/services/categories.service";
import {
  fetchArtisanProfile,
  type ArtisanProfileRow,
} from "./artisan-profile.service";
import { uploadVerificationDocument } from "./verification-doc.service";

export type SubmitOnboardingInput = {
  userId: string;
  yearsExperience: string;
  skillSlugs: string[];
  availability: Availability;
  bio: string;
  proofOfAddressUri: string;
  proofOfAddressFileName: string;
  resumeUri: string;
  resumeFileName: string;
  facePhotoUri: string;
  guarantors: ArtisanGuarantorsInput;
};

async function resolveCategoryIds(skillSlugs: string[]): Promise<{
  primaryId: string;
  additionalIds: string[];
}> {
  const categories = await fetchServiceCategories();
  const ids = skillSlugs
    .map((slug) => categories.find((category) => category.slug === slug)?.id)
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) {
    throw new Error("Select at least one valid skill.");
  }

  return {
    primaryId: ids[0],
    additionalIds: ids.slice(1),
  };
}

async function insertVerificationDocument(
  artisanProfileId: string,
  docType: string,
  storagePath: string,
  fileName?: string,
): Promise<void> {
  const { error } = await supabase.from("verification_documents").insert({
    artisan_profile_id: artisanProfileId,
    doc_type: docType,
    storage_path: storagePath,
    file_name: fileName ?? null,
  });

  if (error) throw error;
}

export async function submitArtisanOnboarding(
  input: SubmitOnboardingInput,
): Promise<{ error?: string; profile?: ArtisanProfileRow }> {
  let primaryId: string;
  let additionalIds: string[];
  try {
    ({ primaryId, additionalIds } = await resolveCategoryIds(input.skillSlugs));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Invalid skills selected." };
  }

  const { error: profileError } = await supabase.from("artisan_profiles").upsert(
    {
      user_id: input.userId,
      years_experience: input.yearsExperience,
      bio: input.bio,
      availability: input.availability,
      primary_skill_category_id: primaryId,
      additional_skill_category_ids: additionalIds,
      verification_status: "pending",
    },
    { onConflict: "user_id" },
  );

  if (profileError) {
    return { error: profileError.message };
  }

  const profile = await fetchArtisanProfile(input.userId);
  if (!profile) {
    return { error: "Could not load artisan profile after save." };
  }

  try {
    const proofPath = await uploadVerificationDocument(
      input.userId,
      "proof_of_address",
      input.proofOfAddressUri,
    );
    await insertVerificationDocument(
      profile.id,
      "proof_of_address",
      proofPath,
      input.proofOfAddressFileName,
    );

    const resumePath = await uploadVerificationDocument(input.userId, "resume", input.resumeUri);
    await insertVerificationDocument(profile.id, "resume", resumePath, input.resumeFileName);

    const facePath = await uploadVerificationDocument(
      input.userId,
      "face_verification",
      input.facePhotoUri,
    );
    await insertVerificationDocument(profile.id, "face_verification", facePath, "face.jpg");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to upload verification documents.",
    };
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      onboarding_guarantors: [input.guarantors.firstGuarantor, input.guarantors.secondGuarantor],
      onboarding_completed_at: new Date().toISOString(),
    },
  });

  if (metadataError) {
    return { error: metadataError.message };
  }

  void notifyArtisanApplication(profile.id);

  return { profile: await fetchArtisanProfile(input.userId) ?? profile };
}
