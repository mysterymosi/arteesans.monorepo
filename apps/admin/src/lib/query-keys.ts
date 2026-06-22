import type {
  ArtisanApplicationListItem,
  RequestFiltersInput,
} from "@arteesans/shared";
import type { PaginationParams } from "@/lib/pagination";

export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
  },
  serviceRequests: {
    all: ["service-requests"] as const,
    lists: () => [...queryKeys.serviceRequests.all, "list"] as const,
    list: (
      filters: RequestFiltersInput = {},
      pagination: PaginationParams,
    ) => [...queryKeys.serviceRequests.lists(), filters, pagination] as const,
    details: () => [...queryKeys.serviceRequests.all, "detail"] as const,
    detail: (requestId: string | undefined) =>
      [...queryKeys.serviceRequests.details(), requestId] as const,
  },
  artisanApplications: {
    all: ["artisan-applications"] as const,
    lists: () => [...queryKeys.artisanApplications.all, "list"] as const,
    list: (
      status: ArtisanApplicationListItem["verificationStatus"] | undefined,
      pagination: PaginationParams,
    ) => [...queryKeys.artisanApplications.lists(), status, pagination] as const,
    details: () => [...queryKeys.artisanApplications.all, "detail"] as const,
    detail: (userId: string | undefined) =>
      [...queryKeys.artisanApplications.details(), userId] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
  },
} as const;
