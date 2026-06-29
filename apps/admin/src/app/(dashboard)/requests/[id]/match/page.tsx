import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound, redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getServiceRequestDetail } from "@/features/requests";
import {
  getMatchSuggestions,
  RequestMatchClient,
} from "@/features/matching";

export default async function RequestMatchPage({
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

  if (request.status !== "matching") {
    redirect(`/requests/${id}`);
  }

  await queryClient.prefetchQuery({
    queryKey: queryKeys.matching.suggestions(id),
    queryFn: () => getMatchSuggestions(id),
  });

  return (
    <DashboardPage title="Admin override — match artisan">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RequestMatchClient request={request} />
      </HydrationBoundary>
    </DashboardPage>
  );
}
