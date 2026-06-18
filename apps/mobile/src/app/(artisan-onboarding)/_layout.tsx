import { Stack } from "expo-router";
import { OnboardingProvider } from "@/features/artisan-onboarding";

export default function ArtisanOnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}
