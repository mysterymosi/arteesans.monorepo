"use client";

import type { ArtisanApplicationListItem } from "@arteesans/shared";
import { useArtisanApplications } from "@/features/artisans/hooks/use-artisan-applications";
import {
  ArtisanApplicationsTable,
  ArtisanStatusFilter,
} from "./artisan-applications-table";

export function ArtisanApplicationsClient({
  status,
}: {
  status: ArtisanApplicationListItem["verificationStatus"];
}) {
  const applicationsQuery = useArtisanApplications(status);

  return (
    <>
      <ArtisanStatusFilter current={status} />
      {applicationsQuery.isError ? (
        <p className="px-4 text-sm text-destructive lg:px-6">
          Unable to load artisan applications.
        </p>
      ) : (
        <ArtisanApplicationsTable applications={applicationsQuery.data ?? []} />
      )}
    </>
  );
}
