"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCategory } from "@/features/categories/hooks/use-categories";
import { CategoryForm } from "./category-form";

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createMutation = useCreateCategory();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Add a service category operators can use when reviewing requests.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          isPending={createMutation.isPending}
          onSubmit={(input) =>
            createMutation.mutate(input, {
              onSuccess: () => onOpenChange(false),
            })
          }
          submitLabel="Create category"
        />
      </DialogContent>
    </Dialog>
  );
}
