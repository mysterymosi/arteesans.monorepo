"use client";

import * as React from "react";
import { fetchJson } from "@/lib/fetch-json";
import type { PaginatedResult } from "@/lib/pagination";
import type { DataTableFetchData } from "./data-table";
import { withQuery } from "@/lib/endpoints";

export function DataTableFetcher<
  TData,
  TFilters extends Record<string, string | undefined>,
>({
  url,
  children,
}: {
  url: string;
  children: (props: {
    fetchData: DataTableFetchData<TData, TFilters>;
  }) => React.ReactNode;
}) {
  const fetchData = React.useCallback<DataTableFetchData<TData, TFilters>>(
    (params) => fetchJson<PaginatedResult<TData>>(withQuery(url, { ...params.filters, page: params.pagination.page, pageSize: params.pagination.pageSize })),
    [url],
  );

  return children({ fetchData });
}
