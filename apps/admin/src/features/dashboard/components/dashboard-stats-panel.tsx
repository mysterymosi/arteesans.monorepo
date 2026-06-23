"use client";

import { SectionCards } from "@/components/section-cards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

export function DashboardStatsPanel() {
  const { data, isError, isPending } = useDashboardStats();

  if (isPending) {
    return (
      <div className="grid max-w-5xl gap-3 px-4 md:grid-cols-3 lg:px-6">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="px-4 lg:px-6">
        <Alert variant="destructive">
          <AlertTitle>Unable to load overview</AlertTitle>
          <AlertDescription>
            Dashboard workload totals are unavailable right now.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <SectionCards stats={data} />;
}
