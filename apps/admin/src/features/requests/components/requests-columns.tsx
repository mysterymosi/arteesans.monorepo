"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { ServiceRequestListItem } from "@arteesans/shared";
import { CategoryIcon } from "@/components/category-icon";
import { DataTableColumnHeader, TableRowActions } from "@/components/data-table";
import { RequestStatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";


function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

const urgencyDotClass: Record<ServiceRequestListItem["urgency"], string> = {
  emergency: "bg-destructive",
  urgent: "bg-destructive",
  normal: "bg-warning",
  flexible: "bg-primary",
};

export const requestColumns: ColumnDef<ServiceRequestListItem>[] = [
  {
    accessorKey: "customerName",
    meta: { label: "Client" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => (
      <div className="min-w-56">
        <div className="font-medium">{row.original.customerName}</div>
        <div className="truncate text-sm text-muted-foreground max-w-56">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "categoryName",
    meta: { label: "Category" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 font-medium">
        <CategoryIcon
          categoryName={row.original.categoryName}
          className="size-4 text-muted-foreground"
        />
        {row.original.categoryName}
      </span>
    ),
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "urgency",
    meta: { label: "Urgency" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Urgency" />
    ),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 font-medium">
        <span
          className={cn("size-2 rounded-full", urgencyDotClass[row.original.urgency])}
        />
        {row.original.urgency.charAt(0).toUpperCase() +
          row.original.urgency.slice(1)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { label: "Updated" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => <span className="text-muted-foreground uppercase font-medium">{formatTime(row.original.createdAt)}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <TableRowActions
        label="Open request actions"
        actions={[
          {
            label: "View request",
            render: <Link href={`/requests/${row.original.id}`} />,
          },
          ...(row.original.status === "matching"
            ? [
              {
                label: "Match artisan",
                render: <Link href={`/requests/${row.original.id}/match`} />,
              },
            ]
            : []),
        ]}
      />
    ),
  },
];
