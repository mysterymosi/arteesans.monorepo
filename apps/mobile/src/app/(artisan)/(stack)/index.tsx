import { ArtisanHomeDashboard } from "@/features/artisan";
import { formatArtisanLocationLabel, useArtisanProfile } from "@/features/artisan-onboarding";
import { useAuthProfile, useAuthSession } from "@/providers/auth-provider";

/** Artisan dashboard — Figma 36:2476; job intake hidden until approved (Phase 1.4). */
export default function ArtisanDashboard() {
  const { session } = useAuthSession();
  const { profile } = useAuthProfile();
  const { data: artisanProfile, isLoading: profileLoading } = useArtisanProfile(
    session?.user.id,
  );

  const locationLabel = profileLoading
    ? "..."
    : formatArtisanLocationLabel(artisanProfile) ?? "Add your address";

  return (
    <ArtisanHomeDashboard
      firstName={profile?.first_name ?? ""}
      locationLabel={locationLabel}
      verificationStatus={artisanProfile?.verification_status ?? "pending"}
    />
  );
}
