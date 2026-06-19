"use server";

import { categoryFormSchema, type ActionState } from "@arteesans/shared";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAction } from "./audit";

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    startingPriceMin: formData.get("startingPriceMin") || null,
    startingPriceMax: formData.get("startingPriceMax") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const service = createServiceClient();
  const { data, error } = await service
    .from("service_categories")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      starting_price_min: parsed.data.startingPriceMin ?? null,
      starting_price_max: parsed.data.startingPriceMax ?? null,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to create category" };
  }

  await logAdminAction({
    actionType: "create",
    entityType: "service_category",
    entityId: data.id,
    metadata: parsed.data,
  });

  revalidatePath("/categories");
  return {};
}

export async function updateCategory(
  categoryId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    startingPriceMin: formData.get("startingPriceMin") || null,
    startingPriceMax: formData.get("startingPriceMax") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const service = createServiceClient();
  const { error } = await service
    .from("service_categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      starting_price_min: parsed.data.startingPriceMin ?? null,
      starting_price_max: parsed.data.startingPriceMax ?? null,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction({
    actionType: "update",
    entityType: "service_category",
    entityId: categoryId,
    metadata: parsed.data,
  });

  revalidatePath("/categories");
  return {};
}

export async function deactivateCategory(
  categoryId: string,
): Promise<ActionState> {
  const service = createServiceClient();
  const { error } = await service
    .from("service_categories")
    .update({ is_active: false })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction({
    actionType: "deactivate",
    entityType: "service_category",
    entityId: categoryId,
  });

  revalidatePath("/categories");
  return {};
}

export async function deactivateCategoryAction(
  formData: FormData,
): Promise<void> {
  const categoryId = formData.get("categoryId");
  if (typeof categoryId !== "string" || !categoryId) {
    return;
  }
  await deactivateCategory(categoryId);
}
