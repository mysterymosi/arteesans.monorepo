"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { ServiceRequestListItem } from "@arteesans/shared";
import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";

export const requestColumns: ColumnDef<ServiceRequestListItem>[] = [
  {
    accessorKey: "customerName",
    meta: { label: "Customer" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="min-w-56">
        <div className="font-medium">{row.original.customerName}</div>
        <div className="line-clamp-1 text-sm text-muted-foreground">
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
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
  },
  {
    accessorKey: "urgency",
    meta: { label: "Urgency" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Urgency" />
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { label: "Created" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          href={`/requests/${row.original.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View
        </Link>
      </div>
    ),
  },
];
