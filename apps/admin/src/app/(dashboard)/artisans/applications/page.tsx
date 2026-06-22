import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { VERIFICATION_STATUSES } from "@arteesans/shared";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import {
  ArtisanApplicationsClient,
  getArtisanApplications,
} from "@/features/artisans";

export default async function ArtisanApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: (typeof VERIFICATION_STATUSES)[number];
  }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "pending";
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.artisanApplications.list(status),
    queryFn: () => getArtisanApplications(status),
  });

  return (
    <DashboardPage title="Artisan applications">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ArtisanApplicationsClient status={status} />
      </HydrationBoundary>
    </DashboardPage>
  );
}
