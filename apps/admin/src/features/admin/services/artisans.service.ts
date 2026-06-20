import type {
  ArtisanApplicationDetail,
  ArtisanApplicationListItem,
} from "@arteesans/shared";
import { createServiceClient } from "@/lib/supabase/server";
import { createSignedUrls, formatName } from "./utils";

type ArtisanStatus = ArtisanApplicationListItem["verificationStatus"];
type ArtisanStatusUpdateResult =
  | { error: string }
  | { profileId: string; previousStatus: ArtisanStatus };

export async function getArtisanApplications(
  status?: ArtisanStatus,
): Promise<ArtisanApplicationListItem[]> {
  const service = createServiceClient();

  let query = service
    .from("artisan_profiles")
    .select(
      `
      id,
      user_id,
      verification_status,
      state,
      created_at,
      user:users!artisan_profiles_user_id_fkey(first_name, last_name, email, phone),
      primary_skill:service_categories!artisan_profiles_primary_skill_category_id_fkey(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("verification_status", status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const user = Array.isArray(row.user) ? row.user[0] : row.user;
    const primarySkill = Array.isArray(row.primary_skill)
      ? row.primary_skill[0]
      : row.primary_skill;

    return {
      profileId: row.id,
      userId: row.user_id,
      name: formatName(
        user?.first_name ?? null,
        user?.last_name ?? null,
        user?.email ?? null,
      ),
      email: user?.email ?? null,
      phone: user?.phone ?? null,
      verificationStatus: row.verification_status,
      primarySkill: primarySkill?.name ?? null,
      state: row.state,
      submittedAt: row.created_at,
    };
  });
}

export async function getArtisanApplicationDetail(
  userId: string,
): Promise<ArtisanApplicationDetail | null> {
  const service = createServiceClient();

  const { data, error } = await service
    .from("artisan_profiles")
    .select(
      `
      id,
      user_id,
      verification_status,
      state,
      created_at,
      bio,
      years_experience,
      availability,
      address,
      user:users!artisan_profiles_user_id_fkey(first_name, last_name, email, phone),
      primary_skill:service_categories!artisan_profiles_primary_skill_category_id_fkey(name),
      verification_documents(id, doc_type, file_name, storage_path)
    `,
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const user = Array.isArray(data.user) ? data.user[0] : data.user;
  const primarySkill = Array.isArray(data.primary_skill)
    ? data.primary_skill[0]
    : data.primary_skill;
  const documents = data.verification_documents ?? [];
  const signedUrls = await createSignedUrls(
    "verification-docs",
    documents.map((doc) => doc.storage_path),
  );

  return {
    profileId: data.id,
    userId: data.user_id,
    name: formatName(
      user?.first_name ?? null,
      user?.last_name ?? null,
      user?.email ?? null,
    ),
    email: user?.email ?? null,
    phone: user?.phone ?? null,
    verificationStatus: data.verification_status,
    primarySkill: primarySkill?.name ?? null,
    state: data.state,
    submittedAt: data.created_at,
    bio: data.bio,
    yearsExperience: data.years_experience,
    availability: data.availability,
    address: data.address,
    documents: documents.map((doc, index) => ({
      id: doc.id,
      docType: doc.doc_type,
      fileName: doc.file_name,
      url: signedUrls[index] ?? "",
    })),
  };
}

export async function updateArtisanVerificationStatus(
  userId: string,
  verificationStatus: ArtisanStatus,
): Promise<ArtisanStatusUpdateResult> {
  const service = createServiceClient();
  const { data: profile, error: fetchError } = await service
    .from("artisan_profiles")
    .select("id, verification_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError || !profile) {
    return { error: fetchError?.message ?? "Artisan profile not found" };
  }

  const { error } = await service
    .from("artisan_profiles")
    .update({ verification_status: verificationStatus })
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  return {
    profileId: profile.id,
    previousStatus: profile.verification_status,
  };
}
