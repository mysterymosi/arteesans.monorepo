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
} as const;
