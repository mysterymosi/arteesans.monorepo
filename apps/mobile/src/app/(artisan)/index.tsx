import { ArtisanHomeDashboard } from "@/features/artisan";
import { useArtisanProfile } from "@/features/artisan-onboarding";
import { useAuthProfile, useAuthSession } from "@/providers/auth-provider";

/** Artisan dashboard — Figma 36:2476; job intake hidden until approved (Phase 1.4). */
export default function ArtisanDashboard() {
  const { session } = useAuthSession();
  const { profile } = useAuthProfile();
  const { data: artisanProfile } = useArtisanProfile(session?.user.id);

  return (
    <ArtisanHomeDashboard
      firstName={profile?.first_name ?? ""}
      city={artisanProfile?.city_lga}
      verificationStatus={artisanProfile?.verification_status ?? "pending"}
    />
  );
}
