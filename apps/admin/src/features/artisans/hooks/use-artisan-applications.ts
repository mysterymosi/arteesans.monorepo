"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ArtisanApplicationDetail,
  RejectArtisanInput,
  RequestMoreInfoInput,
} from "@arteesans/shared";
import { fetchJson } from "@/lib/fetch-json";
import { endpoints } from "@/lib/endpoints";
import {
  assertActionSuccess,
  toastMutationError,
} from "@/lib/mutation-toast";
import { queryKeys } from "@/lib/query-keys";
import {
  approveArtisan,
  rejectArtisan,
  requestMoreInfo,
} from "@/features/artisans/actions/artisans";

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
    mutationFn: async (userId: string) => {
      assertActionSuccess(await approveArtisan(userId));
    },
    onSuccess: () => {
      toast.success("Artisan approved");
      queryClient.invalidateQueries({
        queryKey: queryKeys.artisanApplications.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => toastMutationError(error, "Failed to approve artisan"),
  });
}

export function useRejectArtisan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RejectArtisanInput) => {
      assertActionSuccess(await rejectArtisan(input));
    },
    onSuccess: () => {
      toast.success("Artisan rejected");
      queryClient.invalidateQueries({
        queryKey: queryKeys.artisanApplications.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => toastMutationError(error, "Failed to reject artisan"),
  });
}

export function useRequestMoreInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RequestMoreInfoInput) => {
      assertActionSuccess(await requestMoreInfo(input));
    },
    onSuccess: () => {
      toast.success("Information requested");
      queryClient.invalidateQueries({
        queryKey: queryKeys.artisanApplications.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) =>
      toastMutationError(error, "Failed to request more information"),
  });
}
