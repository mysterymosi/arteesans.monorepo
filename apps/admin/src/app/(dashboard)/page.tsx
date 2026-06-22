import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { DashboardStatsPanel, getDashboardStats } from "@/features/dashboard";

export default async function OverviewPage() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: getDashboardStats,
  });

  return (
    <DashboardPage title="Overview">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardStatsPanel />
      </HydrationBoundary>
    </DashboardPage>
  );
}
