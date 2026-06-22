"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ActionState,
  ArtisanApplicationDetail,
  ArtisanApplicationListItem,
} from "@arteesans/shared";
import { fetchJson } from "@/lib/fetch-json";
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

function applicationsUrl(
  status: ArtisanApplicationListItem["verificationStatus"] | undefined,
) {
  return status
    ? `/api/artisans/applications?status=${encodeURIComponent(status)}`
    : "/api/artisans/applications";
}

export function useArtisanApplications(
  status: ArtisanApplicationListItem["verificationStatus"] | undefined,
) {
  return useQuery({
    queryKey: queryKeys.artisanApplications.list(status),
    queryFn: () =>
      fetchJson<ArtisanApplicationListItem[]>(applicationsUrl(status)),
  });
}

export function useArtisanApplication(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.artisanApplications.detail(userId),
    queryFn: () =>
      fetchJson<ArtisanApplicationDetail>(
        `/api/artisans/applications/${userId}`,
      ),
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
