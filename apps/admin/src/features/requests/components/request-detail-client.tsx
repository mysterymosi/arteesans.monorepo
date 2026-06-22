"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useServiceRequest } from "@/features/requests/hooks/use-requests";
import { RequestDetailView } from "./request-detail";

export function RequestDetailClient({ requestId }: { requestId: string }) {
  const { data, isError, isPending } = useServiceRequest(requestId);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        Unable to load request detail.
      </p>
    );
  }

  return <RequestDetailView request={data} />;
}
