import type { Href } from "expo-router";
import type { UserRole } from "@arteesans/shared";

type AppRole = Exclude<UserRole, "admin">;

/** Central route paths for expo-router navigation. */
export const routes = {
  auth: {
    welcome: "/(auth)/welcome",
    login: "/(auth)/login",
    signUp: "/(auth)/sign-up",
    verifyOtp: "/(auth)/verify-otp",
    roleSelect: "/(auth)/role-select",
    completeProfile: "/(auth)/complete-profile",
  },
  customer: "/(customer)",
  artisan: "/(artisan)",
} as const;

export function verifyOtpRoute(params: { email: string; role?: string }): Href {
  return { pathname: routes.auth.verifyOtp, params };
}

export function completeProfileRoute(params: { role: AppRole }): Href {
  return { pathname: routes.auth.completeProfile, params };
}

export function homeRouteForRole(role: AppRole): Href {
  return role === "artisan" ? routes.artisan : routes.customer;
}
