"use client";

import { SectionCards } from "@/components/section-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

export function DashboardStatsPanel() {
  const { data, isError, isPending } = useDashboardStats();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        Unable to load dashboard stats.
      </p>
    );
  }

  return <SectionCards stats={data} />;
}
