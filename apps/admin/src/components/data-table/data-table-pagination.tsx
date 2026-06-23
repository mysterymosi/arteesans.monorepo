"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/lib/pagination";

export function DataTablePagination<TData>({
  table,
  totalRows,
}: {
  table: Table<TData>;
  totalRows: number;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(totalRows, (pageIndex + 1) * pageSize);
  const pages = Array.from(
    { length: Math.min(pageCount, 3) },
    (_, index) => index,
  );

  return (
    <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
      <div className="text-sm font-medium text-foreground">
        {start}-{end} of {totalRows}
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
          <span className="sr-only">Previous page</span>
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            type="button"
            variant={page === pageIndex ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => table.setPageIndex(page)}
          >
            {page + 1}
          </Button>
        ))}
        {pageCount > 4 ? (
          <span className="px-2 text-sm text-muted-foreground">...</span>
        ) : null}
        {pageCount > 3 ? (
          <Button
            type="button"
            variant={pageCount - 1 === pageIndex ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            {pageCount}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
      <div className="flex justify-start md:justify-end">
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger size="sm" className="h-10 w-32 rounded-md">
            <SelectValue />
            <span className="text-muted-foreground">/ page</span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
