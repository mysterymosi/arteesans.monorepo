"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { ArtisanApplicationListItem } from "@arteesans/shared";
import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";

export const artisanApplicationColumns: ColumnDef<ArtisanApplicationListItem>[] = [
  {
    accessorKey: "name",
    meta: { label: "Artisan" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Artisan" />
    ),
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.email ?? row.original.phone ?? "No contact"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "primarySkill",
    meta: { label: "Skill" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Skill" />
    ),
    cell: ({ row }) => row.original.primarySkill ?? "—",
  },
  {
    accessorKey: "state",
    meta: { label: "State" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => row.original.state ?? "—",
  },
  {
    accessorKey: "verificationStatus",
    meta: { label: "Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.verificationStatus}</Badge>
    ),
  },
  {
    accessorKey: "submittedAt",
    meta: { label: "Submitted" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          href={`/artisans/applications/${row.original.userId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Review
        </Link>
      </div>
    ),
  },
];
