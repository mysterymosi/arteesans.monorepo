"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CategoryFormInput, CategoryListItem } from "@arteesans/shared";
import { endpoints } from "@/lib/endpoints";
import { fetchJson } from "@/lib/fetch-json";
import {
  assertActionSuccess,
  toastMutationError,
} from "@/lib/mutation-toast";
import { queryKeys } from "@/lib/query-keys";
import {
  createCategory,
  deactivateCategory,
  updateCategory,
} from "@/features/categories/actions/categories";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => fetchJson<CategoryListItem[]>(endpoints.categories.list),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CategoryFormInput) => {
      assertActionSuccess(await createCategory(input));
    },
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (error) => toastMutationError(error, "Failed to create category"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      input,
    }: {
      categoryId: string;
      input: CategoryFormInput;
    }) => {
      assertActionSuccess(await updateCategory(categoryId, input));
    },
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (error) => toastMutationError(error, "Failed to update category"),
  });
}

export function useDeactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      assertActionSuccess(await deactivateCategory(categoryId));
    },
    onSuccess: () => {
      toast.success("Category deactivated");
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (error) =>
      toastMutationError(error, "Failed to deactivate category"),
  });
}
