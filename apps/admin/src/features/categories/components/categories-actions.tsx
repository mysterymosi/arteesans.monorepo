"use client";

import * as React from "react";
import type { CategoryListItem } from "@arteesans/shared";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TableRowActions } from "@/components/data-table";
import { useDeactivateCategory } from "@/features/categories/hooks/use-categories";
import { UpdateCategoryDialog } from "./update-category-dialog";

export function CategoriesActions({
  category,
}: {
  category: CategoryListItem;
}) {
  const deactivateMutation = useDeactivateCategory();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false);

  return (
    <>
      <TableRowActions
        label="Open category actions"
        actions={[
          {
            label: "Edit category",
            onSelect: () => setIsEditOpen(true),
          },
          ...(category.isActive
            ? [
                {
                  label: "Deactivate",
                  onSelect: () => setIsDeactivateOpen(true),
                  disabled: deactivateMutation.isPending,
                  destructive: true,
                },
              ]
            : []),
        ]}
      />

      <UpdateCategoryDialog
        category={category}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ConfirmDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        title="Deactivate category?"
        description={`This will deactivate ${category.name}. It will no longer be available for new requests.`}
        confirmLabel="Deactivate"
        confirmVariant="destructive"
        isPending={deactivateMutation.isPending}
        onConfirm={() => {
          deactivateMutation.mutate(category.id, {
            onSuccess: () => setIsDeactivateOpen(false),
          });
        }}
      />
    </>
  );
}
