import type { Href } from "expo-router";
import { isArtisanOnboardingComplete } from "@/features/artisan-onboarding/services/artisan-profile.service";
import type { UserProfile } from "@/features/auth/types";
import { completeProfileRoute, homeRouteForRole, routes } from "@/lib/routes";

/** Sync route for incomplete profiles only (used by app index gate). */
export function getPostAuthRoute(profile: UserProfile | null): Href {
  if (!profile?.role) {
    return routes.auth.roleSelect;
  }

  if (!profile.first_name || !profile.phone) {
    if (profile.role === "customer" || profile.role === "artisan") {
      return completeProfileRoute({ role: profile.role });
    }
    return routes.auth.welcome;
  }

  if (profile.role === "artisan") {
    return "/";
  }

  if (profile.role === "customer") {
    return homeRouteForRole(profile.role);
  }

  return routes.auth.welcome;
}

/** Resolves post-auth destination, including artisan onboarding completion check. */
export async function resolvePostAuthRoute(
  profile: UserProfile | null,
  userId: string,
): Promise<Href> {
  if (!profile?.role) {
    return routes.auth.roleSelect;
  }

  if (!profile.first_name || !profile.phone) {
    if (profile.role === "customer" || profile.role === "artisan") {
      return completeProfileRoute({ role: profile.role });
    }
    return routes.auth.welcome;
  }

  if (profile.role === "artisan") {
    const onboardingComplete = await isArtisanOnboardingComplete(userId);
    return onboardingComplete ? routes.artisan : routes.artisanOnboarding.address;
  }

  if (profile.role === "customer") {
    return homeRouteForRole(profile.role);
  }

  return routes.auth.welcome;
}

export function isProfileComplete(profile: UserProfile | null): boolean {
  return Boolean(profile?.role && profile.first_name && profile.phone);
}
