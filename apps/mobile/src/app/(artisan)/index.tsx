import { Text } from "@/components/ui";
import { ArtisanHomeDashboard } from "@/features/artisan";
import { useArtisanProfile } from "@/features/artisan-onboarding";
import { useAuthActions, useAuthProfile, useAuthSession } from "@/providers/auth-provider";
import { Pressable } from "react-native";

/** Artisan dashboard — Figma 36:2476; job intake hidden until approved (Phase 1.4). */
export default function ArtisanDashboard() {
  const { session } = useAuthSession();
  const { profile } = useAuthProfile();
  const { data: artisanProfile } = useArtisanProfile(session?.user.id);
  const { signOut } = useAuthActions();

  return (
    <>
      <Pressable onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Pressable>

      <ArtisanHomeDashboard
        firstName={profile?.first_name ?? ""}
        city={artisanProfile?.city_lga}
        verificationStatus={artisanProfile?.verification_status ?? "pending"}
      />
    </>
  );
}
