"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  RequestFiltersInput,
  ServiceRequestDetail,
  ServiceRequestListItem,
} from "@arteesans/shared";
import { fetchJson } from "@/lib/fetch-json";
import { queryKeys } from "@/lib/query-keys";

function requestListUrl(filters: RequestFiltersInput) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.urgency) params.set("urgency", filters.urgency);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  const query = params.toString();
  return query ? `/api/requests?${query}` : "/api/requests";
}

export function useServiceRequests(filters: RequestFiltersInput = {}) {
  return useQuery({
    queryKey: queryKeys.serviceRequests.list(filters),
    queryFn: () => fetchJson<ServiceRequestListItem[]>(requestListUrl(filters)),
    placeholderData: (previousData) => previousData,
  });
}

export function useServiceRequest(requestId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.serviceRequests.detail(requestId),
    queryFn: () => fetchJson<ServiceRequestDetail>(`/api/requests/${requestId}`),
    enabled: Boolean(requestId),
  });
}
