import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { REQUEST_STATUSES, URGENCY_LEVELS } from "@arteesans/shared";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getCategories } from "@/features/categories";
import { getServiceRequests, RequestsPageClient } from "@/features/requests";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: (typeof REQUEST_STATUSES)[number];
    urgency?: (typeof URGENCY_LEVELS)[number];
    categoryId?: string;
  }>;
}) {
  const filters = await searchParams;
  const queryClient = createQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.serviceRequests.list(filters),
      queryFn: () => getServiceRequests(filters),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.list(),
      queryFn: getCategories,
    }),
  ]);

  return (
    <DashboardPage title="Service requests">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RequestsPageClient filters={filters} />
      </HydrationBoundary>
    </DashboardPage>
  );
}
