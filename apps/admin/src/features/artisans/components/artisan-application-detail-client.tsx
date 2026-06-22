"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useArtisanApplication } from "@/features/artisans/hooks/use-artisan-applications";
import { ArtisanApplicationDetailView } from "./artisan-application-detail";

export function ArtisanApplicationDetailClient({ userId }: { userId: string }) {
  const { data, isError, isPending } = useArtisanApplication(userId);

  if (isPending) {
    return (
      <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        Unable to load artisan application detail.
      </p>
    );
  }

  return <ArtisanApplicationDetailView application={data} />;
}
