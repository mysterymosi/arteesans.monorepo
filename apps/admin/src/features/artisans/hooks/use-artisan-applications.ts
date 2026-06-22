"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ActionState,
  ArtisanApplicationDetail,
} from "@arteesans/shared";
import { fetchJson } from "@/lib/fetch-json";
import { endpoints } from "@/lib/endpoints";
import { queryKeys } from "@/lib/query-keys";
import {
  approveArtisan,
  rejectArtisan,
  requestMoreInfo,
} from "@/features/artisans/actions/artisans";

function assertActionSuccess(result: ActionState) {
  if (result.error) {
    throw new Error(result.error);
  }
}

export function useArtisanApplication(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.artisanApplications.detail(userId),
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required.");
      }

      return fetchJson<ArtisanApplicationDetail>(
        endpoints.artisanApplications.detail(userId),
      );
    },
    enabled: Boolean(userId),
  });
}

export function useApproveArtisan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      assertActionSuccess(await approveArtisan(formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.artisanApplications.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

export function useRejectArtisan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      assertActionSuccess(await rejectArtisan({}, formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.artisanApplications.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

export function useRequestMoreInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      assertActionSuccess(await requestMoreInfo({}, formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.artisanApplications.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
