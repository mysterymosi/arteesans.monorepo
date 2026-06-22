"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ActionState, CategoryListItem } from "@arteesans/shared";
import { fetchJson } from "@/lib/fetch-json";
import { queryKeys } from "@/lib/query-keys";
import {
  createCategory,
  deactivateCategory,
  updateCategory,
} from "@/features/categories/actions/categories";

function assertActionSuccess(result: ActionState) {
  if (result.error) {
    throw new Error(result.error);
  }
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => fetchJson<CategoryListItem[]>("/api/categories"),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      assertActionSuccess(await createCategory({}, formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      formData,
    }: {
      categoryId: string;
      formData: FormData;
    }) => {
      assertActionSuccess(await updateCategory(categoryId, {}, formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useDeactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      assertActionSuccess(await deactivateCategory(formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
