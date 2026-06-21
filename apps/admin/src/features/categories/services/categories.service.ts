import type { CategoryFormInput, CategoryListItem } from "@arteesans/shared";
import { createServiceClient } from "@/lib/supabase/server";

type CategoryMutationResult = { error: string } | { categoryId: string };

function toCategoryMutation(input: CategoryFormInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    starting_price_min: input.startingPriceMin ?? null,
    starting_price_max: input.startingPriceMax ?? null,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  };
}

export async function getCategories(): Promise<CategoryListItem[]> {
  const service = createServiceClient();
  const { data, error } = await service
    .from("service_categories")
    .select(
      "id, name, slug, description, starting_price_min, starting_price_max, sort_order, is_active",
    )
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    startingPriceMin: row.starting_price_min,
    startingPriceMax: row.starting_price_max,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

export async function getCategoryOptions() {
  const categories = await getCategories();
  return categories.filter((category) => category.isActive);
}

export async function createServiceCategory(
  input: CategoryFormInput,
): Promise<CategoryMutationResult> {
  const service = createServiceClient();
  const { data, error } = await service
    .from("service_categories")
    .insert(toCategoryMutation(input))
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to create category" };
  }

  return { categoryId: data.id };
}

export async function updateServiceCategory(
  categoryId: string,
  input: CategoryFormInput,
): Promise<CategoryMutationResult> {
  const service = createServiceClient();
  const { error } = await service
    .from("service_categories")
    .update(toCategoryMutation(input))
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  return { categoryId };
}

export async function deactivateServiceCategory(
  categoryId: string,
): Promise<CategoryMutationResult> {
  const service = createServiceClient();
  const { error } = await service
    .from("service_categories")
    .update({ is_active: false })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  return { categoryId };
}
