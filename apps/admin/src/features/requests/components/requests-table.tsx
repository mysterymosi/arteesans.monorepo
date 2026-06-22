"use client";

import type { RequestFiltersInput, ServiceRequestListItem } from "@arteesans/shared";
import { DataTable, DataTableFetcher } from "@/components/data-table";
import { endpoints } from "@/lib/endpoints";
import { queryKeys } from "@/lib/query-keys";
import { requestColumns } from "./requests-columns";
import { createRequestTableFilters } from "./requests.filters";

type RequestTableFilters = Record<string, string | undefined> &
  RequestFiltersInput;


export function RequestsTable({
  categories,
}: {
  categories: Array<{ id: string; name: string }>;
}) {
  return (
    <DataTableFetcher<ServiceRequestListItem, RequestTableFilters>
      url={endpoints.requests.list}
    >
      {({ fetchData }) => (
        <DataTable
          columns={requestColumns}
          emptyMessage="No service requests match the current filters."
          errorMessage="Unable to load service requests."
          loadingMessage="Refreshing requests..."
          filters={createRequestTableFilters(categories)}
          queryKey={({ filters, pagination }) =>
            queryKeys.serviceRequests.list(filters, pagination)
          }
          fetchData={fetchData}
        />
      )}
    </DataTableFetcher>
  );
}
