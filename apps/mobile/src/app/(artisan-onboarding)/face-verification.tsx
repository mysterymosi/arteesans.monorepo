import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui";
import { FaceScanIllustration, OnboardingLayout } from "@/features/artisan-onboarding";
import { routes } from "@/lib/routes";

/** Face Verification intro — Figma 36:2449 */
export default function ArtisanOnboardingFaceVerification() {
  return (
    <OnboardingLayout
      title="Face Verification"
      subtitle="Place your face in the circle."
      backHref={routes.artisanOnboarding.identity}
      footer={
        <Button
          title="Scan"
          onPress={() => router.push(routes.artisanOnboarding.faceScan)}
          className="mt-2"
        />
      }
    >
      <View className="items-center pt-9">
        <FaceScanIllustration />
      </View>
    </OnboardingLayout>
  );
}
