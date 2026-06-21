"use server";

import { categoryFormSchema, type ActionState } from "@arteesans/shared";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/features/audit";
import {
  createServiceCategory,
  deactivateServiceCategory,
  updateServiceCategory,
} from "@/features/categories/services/categories.service";

function parseCategoryForm(formData: FormData) {
  return categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    startingPriceMin: formData.get("startingPriceMin") || null,
    startingPriceMax: formData.get("startingPriceMax") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });
}

async function logCategoryAction(
  actionType: string,
  categoryId: string,
  metadata?: Record<string, unknown>,
) {
  await logAdminAction({
    actionType,
    entityType: "service_category",
    entityId: categoryId,
    metadata,
  });
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseCategoryForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await createServiceCategory(parsed.data);
  if ("error" in result) {
    return { error: result.error };
  }

  await logCategoryAction("create", result.categoryId, parsed.data);

  revalidatePath("/categories");
  return {};
}

export async function updateCategory(
  categoryId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseCategoryForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await updateServiceCategory(categoryId, parsed.data);
  if ("error" in result) {
    return { error: result.error };
  }

  await logCategoryAction("update", categoryId, parsed.data);

  revalidatePath("/categories");
  return {};
}

export async function deactivateCategory(formData: FormData): Promise<void> {
  const categoryId = formData.get("categoryId");
  if (typeof categoryId !== "string" || !categoryId) {
    return;
  }

  const result = await deactivateServiceCategory(categoryId);
  if ("error" in result) {
    return;
  }

  await logCategoryAction("deactivate", categoryId);

  revalidatePath("/categories");
}
