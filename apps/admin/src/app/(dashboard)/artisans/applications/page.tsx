import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { VERIFICATION_STATUSES } from "@arteesans/shared";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { normalizePagination } from "@/lib/pagination";
import {
  ArtisanApplicationsClient,
  getArtisanApplications,
} from "@/features/artisans";

export default async function ArtisanApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: (typeof VERIFICATION_STATUSES)[number];
    page?: string;
    pageSize?: string;
  }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "pending";
  const pagination = normalizePagination(params);
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.artisanApplications.list(status, pagination),
    queryFn: () => getArtisanApplications(status, pagination),
  });

  return (
    <DashboardPage title="Artisan applications">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ArtisanApplicationsClient />
      </HydrationBoundary>
    </DashboardPage>
  );
}
