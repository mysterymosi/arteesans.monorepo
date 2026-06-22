"use client";

import type { RequestFiltersInput } from "@arteesans/shared";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useServiceRequests } from "@/features/requests/hooks/use-requests";
import { RequestFilters, RequestsTable } from "./requests-table";

export function RequestsPageClient({ filters }: { filters: RequestFiltersInput }) {
  const requestsQuery = useServiceRequests(filters);
  const categoriesQuery = useCategories();

  return (
    <>
      <RequestFilters
        categories={(categoriesQuery.data ?? [])
          .filter((category) => category.isActive)
          .map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        current={filters}
      />
      {requestsQuery.isFetching && !requestsQuery.isPending ? (
        <p className="px-4 text-xs text-muted-foreground lg:px-6">Refreshing requests...</p>
      ) : null}
      {requestsQuery.isError ? (
        <p className="px-4 text-sm text-destructive lg:px-6">
          Unable to load service requests.
        </p>
      ) : (
        <RequestsTable requests={requestsQuery.data ?? []} />
      )}
    </>
  );
}
