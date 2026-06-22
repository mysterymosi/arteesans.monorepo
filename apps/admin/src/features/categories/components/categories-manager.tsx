"use client";

import * as React from "react";
import type { PaginationState } from "@tanstack/react-table";
import type { CategoryListItem } from "@arteesans/shared";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PAGE_SIZE, toPageCount } from "@/lib/pagination";
import {
  useCategories,
  useCreateCategory,
  useDeactivateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-categories";
import { getCategoryColumns } from "./categories-columns";

function CategoryForm({
  onSubmit,
  initial,
  error,
  isPending,
  submitLabel,
}: {
  onSubmit: (formData: FormData) => void;
  initial?: Partial<CategoryListItem>;
  error?: Error | null;
  isPending?: boolean;
  submitLabel: string;
}) {
  return (
    <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
      <Input name="name" placeholder="Name" defaultValue={initial?.name} required />
      <Input name="slug" placeholder="slug" defaultValue={initial?.slug} required />
      <Textarea
        name="description"
        placeholder="Description"
        defaultValue={initial?.description ?? ""}
        className="md:col-span-2"
      />
      <Input
        name="startingPriceMin"
        type="number"
        min="0"
        placeholder="Min price"
        defaultValue={initial?.startingPriceMin ?? ""}
      />
      <Input
        name="startingPriceMax"
        type="number"
        min="0"
        placeholder="Max price"
        defaultValue={initial?.startingPriceMax ?? ""}
      />
      <Input
        name="sortOrder"
        type="number"
        min="0"
        placeholder="Sort order"
        defaultValue={initial?.sortOrder ?? 0}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
        />
        Active
      </label>
      {error ? (
        <p className="text-sm text-destructive md:col-span-2">{error.message}</p>
      ) : null}
      <Button type="submit" disabled={isPending} className="md:col-span-2 md:w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}

export function CategoriesManager() {
  const categoriesQuery = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deactivateMutation = useDeactivateCategory();
  const [editingCategory, setEditingCategory] =
    React.useState<CategoryListItem | null>(null);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const categories = categoriesQuery.data ?? [];
  const pageCount = toPageCount(categories.length, pagination.pageSize);
  const pageData = categories.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
  );
  const columns = React.useMemo(
    () =>
      getCategoryColumns({
        onEdit: setEditingCategory,
        onDeactivate: (categoryId) => {
          const formData = new FormData();
          formData.set("categoryId", categoryId);
          deactivateMutation.mutate(formData);
        },
        isDeactivating: deactivateMutation.isPending,
      }),
    [deactivateMutation],
  );

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            error={createMutation.error}
            isPending={createMutation.isPending}
            onSubmit={(formData) => createMutation.mutate(formData)}
            submitLabel="Create category"
          />
        </CardContent>
      </Card>

      {editingCategory ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit {editingCategory.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              error={updateMutation.error}
              initial={editingCategory}
              isPending={updateMutation.isPending}
              onSubmit={(formData) =>
                updateMutation.mutate(
                  { categoryId: editingCategory.id, formData },
                  { onSuccess: () => setEditingCategory(null) },
                )
              }
              submitLabel="Save changes"
            />
          </CardContent>
        </Card>
      ) : null}

      {categoriesQuery.isError ? (
        <p className="text-sm text-destructive">Unable to load categories.</p>
      ) : null}

      <DataTable
        columns={columns}
        data={pageData}
        emptyMessage="No categories found."
        pageCount={pageCount}
        totalRows={categories.length}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
