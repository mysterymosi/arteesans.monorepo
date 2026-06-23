"use client";

import type { CategoryListItem } from "@arteesans/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCategory } from "@/features/categories/hooks/use-categories";
import { CategoryForm } from "./category-form";

export function UpdateCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: CategoryListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateMutation = useUpdateCategory();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {category.name}</DialogTitle>
          <DialogDescription>
            Update service category details and pricing guidance.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          key={category.id}
          initial={category}
          isPending={updateMutation.isPending}
          onSubmit={(input) =>
            updateMutation.mutate(
              { categoryId: category.id, input },
              { onSuccess: () => onOpenChange(false) },
            )
          }
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}
