"use client";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { RequestsTable } from "./requests-table";

export function RequestsPageClient() {
  const categoriesQuery = useCategories();
  const categories = (categoriesQuery.data ?? [])
    .filter((category) => category.isActive)
    .map((category) => ({ id: category.id, name: category.name }));

  return (
    <>
      {categoriesQuery.isError ? (
        <p className="px-4 text-sm text-destructive lg:px-6">
          Unable to load request filters.
        </p>
      ) : (
        <RequestsTable categories={categories} />
      )}
    </>
  );
}
