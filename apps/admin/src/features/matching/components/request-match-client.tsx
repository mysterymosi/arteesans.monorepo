"use client";

import * as React from "react";
import type { PaginationState } from "@tanstack/react-table";
import type { ServiceRequestDetail } from "@arteesans/shared";
import { FileTextIcon, MapPinIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { DetailBackButton } from "@/components/detail-back-button";
import {
  RequestStatusBadge,
  RequestUrgencyBadge,
} from "@/components/status-badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatNaira } from "@/lib/format";
import { DEFAULT_PAGE_SIZE, toPageCount } from "@/lib/pagination";
import { useMatchSuggestions } from "@/features/matching/hooks/use-matching";
import { getMatchSuggestionColumns } from "./match-suggestions-columns";

function RequestSummary({ request }: { request: ServiceRequestDetail }) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="grid gap-5 p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
        <div className="grid size-14 place-items-center rounded-lg bg-accent text-primary">
          <FileTextIcon className="size-7" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <RequestStatusBadge status={request.status} />
            <RequestUrgencyBadge urgency={request.urgency} />
          </div>
          <h1 className="mt-3 text-2xl font-semibold leading-tight">
            Match artisan for {request.categoryName}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>Customer: {request.customerName}</span>
            <span>·</span>
            <span>Created: {formatDateTime(request.createdAt)}</span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
          <div className="rounded-lg border bg-background px-4 py-3">
            <div className="text-xs font-medium text-muted-foreground">
              Budget
            </div>
            <div className="mt-1 text-lg font-semibold">
              {formatNaira(request.budget)}
            </div>
          </div>
          <div className="rounded-lg border bg-background px-4 py-3">
            <div className="text-xs font-medium text-muted-foreground">
              Preferred time
            </div>
            <div className="mt-1 text-sm font-medium">
              {request.preferredTime
                ? formatDateTime(request.preferredTime)
                : "Not specified"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t px-5 py-3 text-sm text-muted-foreground">
        <MapPinIcon className="size-4" />
        <span>{request.address}</span>
      </div>
    </section>
  );
}

function MatchSuggestionsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-80 rounded-lg" />
    </div>
  );
}

export function RequestMatchClient({
  request,
}: {
  request: ServiceRequestDetail;
}) {
  const suggestionsQuery = useMatchSuggestions(request.id);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const suggestions = suggestionsQuery.data ?? [];
  const pageCount = toPageCount(suggestions.length, pagination.pageSize);
  const pageData = suggestions.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
  );
  const columns = React.useMemo(
    () =>
      getMatchSuggestionColumns({
        requestId: request.id,
      }),
    [request.id],
  );

  if (suggestionsQuery.isPending) {
    return (
      <div className="flex flex-col gap-5 px-4 lg:px-6">
        <DetailBackButton href={`/requests/${request.id}`}>
          Request detail
        </DetailBackButton>
        <MatchSuggestionsSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-6">
      <DetailBackButton href={`/requests/${request.id}`}>
        Request detail
      </DetailBackButton>
      <RequestSummary request={request} />

      {suggestionsQuery.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load match suggestions</AlertTitle>
          <AlertDescription>
            Refresh the page or return to the request detail and try again.
          </AlertDescription>
        </Alert>
      ) : null}

      {suggestions.length === 0 && !suggestionsQuery.isError ? (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>No matching artisans found</EmptyTitle>
            <EmptyDescription>
              There are no approved artisans that match this request category and
              availability window yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DataTable
          title="Suggested artisans"
          columns={columns}
          data={pageData}
          emptyMessage="No matching artisans found."
          viewportPadding={false}
          pageCount={pageCount}
          totalRows={suggestions.length}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}
