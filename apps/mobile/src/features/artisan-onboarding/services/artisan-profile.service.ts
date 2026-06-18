import type { VerificationStatus } from "@arteesans/shared";
import { supabase } from "@/lib/supabase";

export type ArtisanProfileRow = {
  id: string;
  user_id: string;
  state: string | null;
  city_lga: string | null;
  address: string | null;
  years_experience: string | null;
  bio: string | null;
  availability: string | null;
  verification_status: VerificationStatus;
  primary_skill_category_id: string | null;
  additional_skill_category_ids: string[] | null;
};

const REQUIRED_DOC_TYPES = ["proof_of_address", "resume", "face_verification"] as const;

export function formatArtisanAddressLabel(
  profile: Pick<ArtisanProfileRow, "address" | "city_lga" | "state"> | null | undefined,
): string | null {
  if (!profile) return null;

  const parts = [profile.address, profile.city_lga, profile.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export async function fetchArtisanProfile(userId: string): Promise<ArtisanProfileRow | null> {
  const { data, error } = await supabase
    .from("artisan_profiles")
    .select(
      "id, user_id, state, city_lga, address, years_experience, bio, availability, verification_status, primary_skill_category_id, additional_skill_category_ids",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchVerificationDocTypes(artisanProfileId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("verification_documents")
    .select("doc_type")
    .eq("artisan_profile_id", artisanProfileId);

  if (error) throw error;
  return (data ?? []).map((row) => row.doc_type);
}

export async function isArtisanOnboardingComplete(userId: string): Promise<boolean> {
  const profile = await fetchArtisanProfile(userId);
  if (!profile) return false;

  const hasProfileFields = Boolean(
    profile.address &&
      profile.years_experience &&
      profile.bio &&
      profile.availability &&
      profile.primary_skill_category_id,
  );

  if (!hasProfileFields) return false;

  const docTypes = await fetchVerificationDocTypes(profile.id);
  const hasRequiredDocs = REQUIRED_DOC_TYPES.every((type) => docTypes.includes(type));
  if (!hasRequiredDocs) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const guarantors = user?.user_metadata?.onboarding_guarantors;
  return Array.isArray(guarantors) && guarantors.length >= 2;
}
