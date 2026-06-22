"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaginationState } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import {
  categoryFormSchema,
  type CategoryFormInput,
  type CategoryListItem,
} from "@arteesans/shared";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PAGE_SIZE, toPageCount } from "@/lib/pagination";
import {
  useCategories,
  useCreateCategory,
  useDeactivateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-categories";
import { getCategoryColumns } from "./categories-columns";

type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string;
  startingPriceMin?: number | null;
  startingPriceMax?: number | null;
  sortOrder?: number;
  isActive?: boolean;
};

function CategoryForm({
  onSubmit,
  initial,
  isPending,
  submitLabel,
}: {
  onSubmit: (input: CategoryFormInput) => void;
  initial?: Partial<CategoryListItem>;
  isPending?: boolean;
  submitLabel: string;
}) {
  const form = useForm<CategoryFormValues, unknown, CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      startingPriceMin: initial?.startingPriceMin,
      startingPriceMax: initial?.startingPriceMax,
      sortOrder: initial?.sortOrder ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  React.useEffect(() => {
    form.reset({
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      startingPriceMin: initial?.startingPriceMin,
      startingPriceMax: initial?.startingPriceMax,
      sortOrder: initial?.sortOrder ?? 0,
      isActive: initial?.isActive ?? true,
    });
  }, [form, initial]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="md:grid md:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Plumbing"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="plumbing"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="md:col-span-2">
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Short category description"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="startingPriceMin"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Min price</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(
                    event.target.value === "" ? null : Number(event.target.value),
                  )
                }
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="startingPriceMax"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Max price</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(
                    event.target.value === "" ? null : Number(event.target.value),
                  )
                }
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="sortOrder"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Sort order</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(Number(event.target.value))}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="isActive"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel>Active</FieldLabel>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Field className="md:col-span-2 md:w-fit">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
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
          deactivateMutation.mutate(categoryId);
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
            isPending={createMutation.isPending}
            onSubmit={(input) => createMutation.mutate(input)}
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
              initial={editingCategory}
              isPending={updateMutation.isPending}
              onSubmit={(input) =>
                updateMutation.mutate(
                  { categoryId: editingCategory.id, input },
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
