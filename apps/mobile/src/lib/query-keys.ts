/** React Query key factories — single source of truth for cache keys. */
export const queryKeys = {
  serviceCategories: {
    all: ["service-categories"] as const,
  },
  customerRequests: {
    all: ["customer-requests"] as const,
    lists: () => [...queryKeys.customerRequests.all, "list"] as const,
    list: (userId: string | undefined) =>
      [...queryKeys.customerRequests.lists(), userId] as const,
    details: () => [...queryKeys.customerRequests.all, "detail"] as const,
    detail: (requestId: string | undefined) =>
      [...queryKeys.customerRequests.details(), requestId] as const,
  },
  customerDefaultAddress: {
    all: ["customer-default-address"] as const,
    detail: (userId: string | undefined) =>
      [...queryKeys.customerDefaultAddress.all, userId] as const,
  },
  artisanOnboarding: {
    all: ["artisan-onboarding-complete"] as const,
    detail: (userId: string | undefined) =>
      [...queryKeys.artisanOnboarding.all, userId] as const,
  },
  artisanProfile: {
    all: ["artisan-profile"] as const,
    detail: (userId: string | undefined) =>
      [...queryKeys.artisanProfile.all, userId] as const,
  },
  artisanJobs: {
    all: ["artisan-jobs"] as const,
    lists: () => [...queryKeys.artisanJobs.all, "list"] as const,
    list: (userId: string | undefined) =>
      [...queryKeys.artisanJobs.lists(), userId] as const,
    details: () => [...queryKeys.artisanJobs.all, "detail"] as const,
    detail: (requestId: string | undefined) =>
      [...queryKeys.artisanJobs.details(), requestId] as const,
  },
} as const;
