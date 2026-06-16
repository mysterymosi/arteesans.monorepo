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
  customer: {
    home: "/(customer)",
    bookings: "/(customer)/bookings",
    profile: "/(customer)/profile",
    newRequest: "/(customer)/request/new",
    requestConfirmed: "/(customer)/request/confirmed",
  },
  artisan: "/(artisan)",
} as const;

export function verifyOtpRoute(params: { email: string; role?: string }): Href {
  return { pathname: routes.auth.verifyOtp, params };
}

export function completeProfileRoute(params: { role: AppRole }): Href {
  return { pathname: routes.auth.completeProfile, params };
}

export function homeRouteForRole(role: AppRole): Href {
  return role === "artisan" ? routes.artisan : routes.customer.home;
}

export function newRequestRoute(params?: { categorySlug?: string }): Href {
  return params?.categorySlug
    ? { pathname: routes.customer.newRequest, params: { categorySlug: params.categorySlug } }
    : routes.customer.newRequest;
}

export function requestConfirmedRoute(requestId: string): Href {
  return { pathname: routes.customer.requestConfirmed, params: { requestId } };
}
