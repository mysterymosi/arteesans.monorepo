"use client";

import { useQuery } from "@tanstack/react-query";
import type { ServiceRequestDetail } from "@arteesans/shared";
import { fetchJson } from "@/lib/fetch-json";
import { endpoints } from "@/lib/endpoints";
import { queryKeys } from "@/lib/query-keys";

export function useServiceRequest(requestId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.serviceRequests.detail(requestId),
    queryFn: () => {
      if (!requestId) {
        throw new Error("Request ID is required.");
      }

      return fetchJson<ServiceRequestDetail>(endpoints.requests.detail(requestId));
    },
    enabled: Boolean(requestId),
  });
}
