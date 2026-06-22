"use client";

import type { ArtisanApplicationListItem } from "@arteesans/shared";
import {
  DataTable,
  DataTableFetcher,
} from "@/components/data-table";
import { endpoints } from "@/lib/endpoints";
import { queryKeys } from "@/lib/query-keys";
import { artisanApplicationFilters } from "./artisan-applications.filters";
import { artisanApplicationColumns } from "./artisan-applications-columns";

type ArtisanStatus = ArtisanApplicationListItem["verificationStatus"];
type ArtisanApplicationTableFilters = Record<string, string | undefined> & {
  status?: ArtisanStatus;
};

export function ArtisanApplicationsTable() {
  return (
    <DataTableFetcher<
      ArtisanApplicationListItem,
      ArtisanApplicationTableFilters
    >
      url={endpoints.artisanApplications.list}
    >
      {({ fetchData }) => (
        <DataTable
          columns={artisanApplicationColumns}
          emptyMessage="No artisan applications match the current filter."
          errorMessage="Unable to load artisan applications."
          filters={artisanApplicationFilters}
          queryKey={({ filters, pagination }) =>
            queryKeys.artisanApplications.list(filters.status, pagination)
          }
          fetchData={fetchData}
        />
      )}
    </DataTableFetcher>
  );
}
