"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MatchSuggestion } from "@arteesans/shared";
import { endpoints } from "@/lib/endpoints";
import { fetchJson } from "@/lib/fetch-json";
import {
  assertActionSuccess,
  toastMutationError,
} from "@/lib/mutation-toast";
import { queryKeys } from "@/lib/query-keys";
import { assignArtisan } from "@/features/matching/actions/matching";

export function useMatchSuggestions(requestId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.matching.suggestions(requestId),
    queryFn: () => {
      if (!requestId) {
        throw new Error("Request ID is required.");
      }

      return fetchJson<MatchSuggestion[]>(
        endpoints.matching.suggestions(requestId),
      );
    },
    enabled: Boolean(requestId),
  });
}

export function useAssignArtisan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { requestId: string; artisanId: string }) => {
      assertActionSuccess(await assignArtisan(input));
    },
    onSuccess: async (_data, variables) => {
      toast.success("Artisan assigned");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.matching.suggestions(variables.requestId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.serviceRequests.detail(variables.requestId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.serviceRequests.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.all,
        }),
      ]);
    },
    onError: (error) => toastMutationError(error, "Failed to assign artisan"),
  });
}
