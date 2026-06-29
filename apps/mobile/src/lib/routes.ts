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
    home: "/(customer)/(stack)",
    address: "/(customer)/(stack)/address",
    bookings: "/(customer)/(stack)/bookings",
    profile: "/(customer)/(stack)/profile",
    newRequest: "/(customer)/(stack)/request/new",
    requestConfirmed: "/(customer)/(stack)/request/confirmed",
  },
  artisan: {
    home: "/(artisan)/(stack)",
    address: "/(artisan)/(stack)/address",
    jobs: "/(artisan)/(stack)/jobs",
    openRequests: "/(artisan)/(stack)/open-requests",
    chat: "/(artisan)/(stack)/chat",
    earnings: "/(artisan)/(stack)/earnings",
    profile: "/(artisan)/(stack)/profile",
  },
  artisanOnboarding: {
    address: "/(artisan-onboarding)/address",
    identity: "/(artisan-onboarding)/identity",
    faceVerification: "/(artisan-onboarding)/face-verification",
    faceScan: "/(artisan-onboarding)/face-scan",
    faceSuccess: "/(artisan-onboarding)/face-success",
    guarantor: "/(artisan-onboarding)/guarantor",
  },
} as const;

export function verifyOtpRoute(params: { email: string; role?: string }): Href {
  return { pathname: routes.auth.verifyOtp, params };
}

export function completeProfileRoute(params: { role: AppRole }): Href {
  return { pathname: routes.auth.completeProfile, params };
}

export function homeRouteForRole(role: AppRole): Href {
  return role === "artisan" ? routes.artisan.home : routes.customer.home;
}

export function newRequestRoute(params?: { categorySlug?: string }): Href {
  return params?.categorySlug
    ? { pathname: routes.customer.newRequest, params: { categorySlug: params.categorySlug } }
    : routes.customer.newRequest;
}

export function requestConfirmedRoute(requestId: string): Href {
  return { pathname: routes.customer.requestConfirmed, params: { requestId } };
}

export function artisanJobRoute(requestId: string): Href {
  return { pathname: "/(artisan)/(stack)/job/[id]", params: { id: requestId } } as unknown as Href;
}

export function artisanJobTrackingRoute(requestId: string): Href {
  return {
    pathname: "/(artisan)/(stack)/job/[id]/tracking",
    params: { id: requestId },
  } as unknown as Href;
}

export function artisanJobCompleteRoute(requestId: string): Href {
  return {
    pathname: "/(artisan)/(stack)/job/[id]/complete",
    params: { id: requestId },
  } as unknown as Href;
}

export function customerBookingRoute(requestId: string): Href {
  return {
    pathname: "/(customer)/(stack)/booking/[id]",
    params: { id: requestId },
  } as unknown as Href;
}

export function customerBookingTrackingRoute(requestId: string): Href {
  return {
    pathname: "/(customer)/(stack)/booking/[id]/track",
    params: { id: requestId },
  } as unknown as Href;
}

export function customerBookingArtisanRoute(requestId: string, artisanId?: string): Href {
  return {
    pathname: "/(customer)/(stack)/booking/[id]/artisan",
    params: artisanId ? { id: requestId, artisanId } : { id: requestId },
  } as unknown as Href;
}

export function customerBookingArtisansRoute(requestId: string): Href {
  return {
    pathname: "/(customer)/(stack)/booking/[id]/artisans",
    params: { id: requestId },
  } as unknown as Href;
}

export function artisanOpenRequestsRoute(): Href {
  return routes.artisan.openRequests;
}
