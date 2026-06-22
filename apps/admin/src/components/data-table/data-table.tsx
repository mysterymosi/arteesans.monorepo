"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useQuery,
  type QueryKey,
} from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { PaginatedResult, PaginationParams } from "@/lib/pagination";
import { normalizePagination } from "@/lib/pagination";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { useUrlTableState } from "./use-url-table-state";

export type DataTableFetchParams<
  TFilters extends Record<string, string | undefined>,
> = {
  filters: TFilters;
  pagination: PaginationParams;
};

export type DataTableFetchData<
  TData,
  TFilters extends Record<string, string | undefined>,
> = (params: DataTableFetchParams<TFilters>) => Promise<PaginatedResult<TData>>;

export type DataTableFilterOption = {
  label: string;
  value: string;
};

export type DataTableFilter = {
  key: string;
  label: string;
  options: DataTableFilterOption[];
  allLabel?: string;
  defaultValue?: string;
  className?: string;
};

type BaseDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  emptyMessage?: string;
};

type ControlledDataTableProps<TData, TValue> = BaseDataTableProps<TData, TValue> & {
  data: TData[];
  pageCount: number;
  totalRows: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode;
  fetchData?: never;
  queryKey?: never;
  filters?: never;
};

type ServerDataTableProps<
  TData,
  TValue,
  TFilters extends Record<string, string | undefined>,
> = BaseDataTableProps<TData, TValue> & {
  fetchData: DataTableFetchData<TData, TFilters>;
  queryKey: (params: DataTableFetchParams<TFilters>) => QueryKey;
  filters?: DataTableFilter[];
  errorMessage?: string;
  loadingMessage?: string;
  data?: never;
  pageCount?: never;
  totalRows?: never;
  pagination?: never;
  onPaginationChange?: never;
  toolbar?: never;
};

export function DataTable<
  TData,
  TValue,
  TFilters extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(
  props:
    | ControlledDataTableProps<TData, TValue>
    | ServerDataTableProps<TData, TValue, TFilters>,
) {
  if (props.fetchData) {
    return <ServerDataTable {...props} />;
  }

  return <ControlledDataTable {...props} />;
}

function ServerDataTable<
  TData,
  TValue,
  TFilters extends Record<string, string | undefined>,
>({
  columns,
  fetchData,
  queryKey,
  filters: filterDefinitions = [],
  emptyMessage,
  errorMessage = "Unable to load table data.",
  loadingMessage = "Refreshing...",
}: ServerDataTableProps<TData, TValue, TFilters>) {
  const updateUrl = useUrlTableState();
  const searchParams = useSearchParams();
  const pagination = React.useMemo(
    () =>
      normalizePagination({
        page: searchParams.get("page"),
        pageSize: searchParams.get("pageSize"),
      }),
    [searchParams],
  );
  const filters = React.useMemo(() => {
    return filterDefinitions.reduce<Record<string, string | undefined>>(
      (nextFilters, filter) => {
        nextFilters[filter.key] =
          searchParams.get(filter.key) ?? filter.defaultValue;
        return nextFilters;
      },
      {},
    ) as TFilters;
  }, [filterDefinitions, searchParams]);

  const queryParams = React.useMemo(
    () => ({ filters, pagination }),
    [filters, pagination],
  );
  const query = useQuery({
    queryKey: queryKey(queryParams),
    queryFn: () => fetchData(queryParams),
    placeholderData: keepPreviousData,
  });

  const result =
    query.data ??
    ({
      data: [],
      page: pagination.page,
      pageSize: pagination.pageSize,
      pageCount: 1,
      total: 0,
    } satisfies PaginatedResult<TData>);

  const onPaginationChange = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next =
        typeof updater === "function"
          ? updater({
            pageIndex: pagination.page - 1,
            pageSize: pagination.pageSize,
          })
          : updater;

      updateUrl({
        page: String(next.pageIndex + 1),
        pageSize: String(next.pageSize),
      });
    },
    [pagination.page, pagination.pageSize, updateUrl],
  );

  if (query.isError) {
    return (
      <div className="px-4 lg:px-6">
        <Alert variant="destructive">
          <AlertTitle>Unable to load data</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {query.isFetching && !query.isPending ? (
        <p className="px-4 text-xs text-muted-foreground lg:px-6">
          {loadingMessage}
        </p>
      ) : null}
      <ControlledDataTable
        columns={columns}
        data={result.data}
        emptyMessage={emptyMessage}
        pageCount={result.pageCount}
        totalRows={result.total}
        pagination={{
          pageIndex: pagination.page - 1,
          pageSize: pagination.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        toolbar={() => (
          <DataTableFilters
            filters={filterDefinitions}
            values={filters}
            onChange={(updates) => updateUrl({ ...updates, page: "1" })}
          />
        )}
      />
    </>
  );
}

function ControlledDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  totalRows,
  pagination,
  onPaginationChange,
  toolbar,
  emptyMessage = "No results.",
}: ControlledDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-6">
        <div>{toolbar?.(table)}</div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="px-4 lg:px-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-36"
                >
                  <Empty className="border-0 p-4">
                    <EmptyHeader>
                      <EmptyTitle>No rows found</EmptyTitle>
                      <EmptyDescription>{emptyMessage}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalRows={totalRows} />
    </div>
  );
}

function DataTableFilters({
  filters,
  values,
  onChange,
}: {
  filters: DataTableFilter[];
  values: Record<string, string | undefined>;
  onChange: (updates: Record<string, string | null>) => void;
}) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const hasAllOption = Boolean(filter.allLabel);
        const value = values[filter.key] ?? (hasAllOption ? "all" : "");

        return (
          <Select
            key={filter.key}
            value={value}
            onValueChange={(nextValue) =>
              onChange({
                [filter.key]:
                  hasAllOption && nextValue === "all" ? null : nextValue,
              })
            }
          >
            <SelectTrigger size="sm" className={filter.className ?? "w-44"}>
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {hasAllOption ? (
                  <SelectItem value="all">{filter.allLabel}</SelectItem>
                ) : null}
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
