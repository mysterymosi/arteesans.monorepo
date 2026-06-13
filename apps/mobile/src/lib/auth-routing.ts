import type { Href } from "expo-router";
import type { UserProfile } from "@/providers/auth-provider";
import { completeProfileRoute, homeRouteForRole, routes } from "@/lib/routes";

/** Returns the next route after session/profile checks. */
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

  if (profile.role === "customer" || profile.role === "artisan") {
    return homeRouteForRole(profile.role);
  }

  return routes.auth.welcome;
}

export function isProfileComplete(profile: UserProfile | null): boolean {
  return Boolean(profile?.role && profile.first_name && profile.phone);
}
