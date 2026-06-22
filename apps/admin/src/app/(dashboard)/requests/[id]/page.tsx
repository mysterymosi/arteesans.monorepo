import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getServiceRequestDetail, RequestDetailClient } from "@/features/requests";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = createQueryClient();
  const request = await queryClient.ensureQueryData({
    queryKey: queryKeys.serviceRequests.detail(id),
    queryFn: () => getServiceRequestDetail(id),
  });

  if (!request) {
    notFound();
  }

  return (
    <DashboardPage title="Request detail">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RequestDetailClient requestId={id} />
      </HydrationBoundary>
    </DashboardPage>
  );
}
