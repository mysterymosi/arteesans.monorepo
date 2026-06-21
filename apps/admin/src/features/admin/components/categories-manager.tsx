"use client";

import { useActionState } from "react";
import type { CategoryListItem } from "@arteesans/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategory,
  deactivateCategory,
  updateCategory,
} from "@/features/admin/actions/categories";
import type { ActionState } from "@arteesans/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatCurrency(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function CategoryForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: Partial<CategoryListItem>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-3 md:grid-cols-2">
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
      {state.error ? (
        <p className="text-sm text-destructive md:col-span-2">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={isPending} className="md:col-span-2 md:w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}

export function CategoriesManager({ categories }: { categories: CategoryListItem[] }) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm action={createCategory} submitLabel="Create category" />
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Price range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const updateAction = updateCategory.bind(null, category.id);
            return (
              <TableRow key={category.id}>
                <TableCell className="align-top">
                  <div className="font-medium">{category.name}</div>
                  <div className="mt-3">
                    <CategoryForm
                      action={updateAction}
                      initial={category}
                      submitLabel="Save changes"
                    />
                  </div>
                </TableCell>
                <TableCell className="align-top">{category.slug}</TableCell>
                <TableCell className="align-top">
                  {formatCurrency(category.startingPriceMin)} –{" "}
                  {formatCurrency(category.startingPriceMax)}
                </TableCell>
                <TableCell className="align-top">
                  <Badge variant={category.isActive ? "outline" : "secondary"}>
                    {category.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="align-top text-right">
                  {category.isActive ? (
                    <form action={deactivateCategory}>
                      <input type="hidden" name="categoryId" value={category.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Deactivate
                      </Button>
                    </form>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
