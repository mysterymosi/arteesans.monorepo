"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@arteesans/shared";
import { endpoints } from "@/lib/endpoints";
import { fetchJson } from "@/lib/fetch-json";
import { queryKeys } from "@/lib/query-keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => fetchJson<DashboardStats>(endpoints.dashboard.stats),
  });
}
