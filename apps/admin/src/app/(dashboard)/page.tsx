import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardPage } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/page-header";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { DashboardStatsPanel, getDashboardStats } from "@/features/dashboard";
import { RequestsPageClient } from "@/features/requests/components/requests-page-client";

export default async function OverviewPage() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: getDashboardStats,
  });

  return (
    <DashboardPage title="Overview">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageHeader
          title="Overview"
          description="Monitor marketplace workload and jump into the queues that need attention."
        />
        <DashboardStatsPanel />
        <RequestsPageClient />
      </HydrationBoundary>
    </DashboardPage>
  );
}
