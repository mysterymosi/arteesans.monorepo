"use server";

import {
  categoryFormSchema,
  type ActionState,
  type CategoryFormInput,
} from "@arteesans/shared";
import { logAdminAction } from "@/features/audit";
import {
  createServiceCategory,
  deactivateServiceCategory,
  updateServiceCategory,
} from "@/features/categories/services/categories.service";

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
  input: CategoryFormInput,
): Promise<ActionState> {
  const parsed = categoryFormSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await createServiceCategory(parsed.data);
  if ("error" in result) {
    return { error: result.error };
  }

  await logCategoryAction("create", result.categoryId, parsed.data);

  return {};
}

export async function updateCategory(
  categoryId: string,
  input: CategoryFormInput,
): Promise<ActionState> {
  const parsed = categoryFormSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await updateServiceCategory(categoryId, parsed.data);
  if ("error" in result) {
    return { error: result.error };
  }

  await logCategoryAction("update", categoryId, parsed.data);

  return {};
}

export async function deactivateCategory(categoryId: string): Promise<ActionState> {
  if (!categoryId) {
    return { error: "Invalid input" };
  }

  const result = await deactivateServiceCategory(categoryId);
  if ("error" in result) {
    return { error: result.error };
  }

  await logCategoryAction("deactivate", categoryId);

  return {};
}
