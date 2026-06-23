"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { ArtisanApplicationListItem } from "@arteesans/shared";
import { DataTableColumnHeader, TableRowActions } from "@/components/data-table";
import { VerificationStatusBadge } from "@/components/status-badge";
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
      <VerificationStatusBadge status={row.original.verificationStatus} />
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
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <TableRowActions
        label="Open application actions"
        actions={[
          {
            label: "Review application",
            render: (
              <Link href={`/artisans/applications/${row.original.userId}`} />
            ),
          },
        ]}
      />
    ),
  },
];
