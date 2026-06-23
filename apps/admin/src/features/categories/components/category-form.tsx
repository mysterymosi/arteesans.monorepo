"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  categoryFormSchema,
  type CategoryFormInput,
  type CategoryListItem,
} from "@arteesans/shared";
import { Button } from "@/components/ui/button";
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

type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string;
  startingPriceMin?: number | null;
  startingPriceMax?: number | null;
  sortOrder?: number;
  isActive?: boolean;
};

export function CategoryForm({
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
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
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
