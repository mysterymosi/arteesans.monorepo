import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import {
  ArtisanApplicationDetailClient,
  getArtisanApplicationDetail,
} from "@/features/artisans";

export default async function ArtisanApplicationDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const queryClient = createQueryClient();
  const application = await queryClient.ensureQueryData({
    queryKey: queryKeys.artisanApplications.detail(userId),
    queryFn: () => getArtisanApplicationDetail(userId),
  });

  if (!application) {
    notFound();
  }

  return (
    <DashboardPage title="Artisan application">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ArtisanApplicationDetailClient userId={userId} />
      </HydrationBoundary>
    </DashboardPage>
  );
}
