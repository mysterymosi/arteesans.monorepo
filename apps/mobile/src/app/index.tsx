import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { getPostAuthRoute } from "@/features/auth";
import { useArtisanOnboardingComplete } from "@/features/artisan-onboarding";
import { routes } from "@/lib/routes";
import { useAuthProfile, useAuthSession } from "@/providers/auth-provider";

export default function Index() {
  const { session, isLoading } = useAuthSession();
  const { profile, isProfileLoading } = useAuthProfile();
  const { data: onboardingComplete, isLoading: onboardingLoading } = useArtisanOnboardingComplete(
    profile?.role === "artisan" ? session?.user.id : undefined,
  );

  if (isLoading || (session && isProfileLoading)) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={routes.auth.welcome} />;
  }

  if (!profile?.role || !profile.first_name || !profile.phone) {
    return <Redirect href={getPostAuthRoute(profile)} />;
  }

  if (profile.role === "artisan") {
    if (onboardingLoading) {
      return (
        <View className="flex-1 items-center justify-center bg-bg">
          <ActivityIndicator />
        </View>
      );
    }

    if (!onboardingComplete) {
      return <Redirect href={routes.artisanOnboarding.address} />;
    }

    return <Redirect href={routes.artisan} />;
  }

  if (profile.role === "customer") {
    return <Redirect href={routes.customer.home} />;
  }

  return <Redirect href={routes.auth.welcome} />;
}
