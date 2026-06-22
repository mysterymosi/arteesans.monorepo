"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { CategoryListItem } from "@arteesans/shared";
import { DataTableColumnHeader } from "@/components/data-table";
import { CategoryStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/format";

export function getCategoryColumns({
  onEdit,
  onDeactivate,
  isDeactivating,
}: {
  onEdit: (category: CategoryListItem) => void;
  onDeactivate: (categoryId: string) => void;
  isDeactivating?: boolean;
}): ColumnDef<CategoryListItem>[] {
  return [
    {
      accessorKey: "name",
      meta: { label: "Name" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          {row.original.description ? (
            <div className="line-clamp-1 text-sm text-muted-foreground">
              {row.original.description}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "slug",
      meta: { label: "Slug" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
    },
    {
      id: "priceRange",
      meta: { label: "Price range" },
      header: "Price range",
      cell: ({ row }) =>
        `${formatNaira(row.original.startingPriceMin)} – ${formatNaira(
          row.original.startingPriceMax,
        )}`,
    },
    {
      accessorKey: "isActive",
      meta: { label: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <CategoryStatusBadge isActive={row.original.isActive} />,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          {row.original.isActive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeactivating}
              onClick={() => onDeactivate(row.original.id)}
            >
              Deactivate
            </Button>
          ) : null}
        </div>
      ),
    },
  ];
}
