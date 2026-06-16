import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { getPostAuthRoute } from "@/features/auth";
import { homeRouteForRole, routes } from "@/lib/routes";
import { useAuthProfile, useAuthSession } from "@/providers/auth-provider";

export default function Index() {
  const { session, isLoading } = useAuthSession();
  const { profile, isProfileLoading } = useAuthProfile();

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

  if (profile.role === "customer" || profile.role === "artisan") {
    return <Redirect href={homeRouteForRole(profile.role)} />;
  }

  return <Redirect href={routes.auth.welcome} />;
}
