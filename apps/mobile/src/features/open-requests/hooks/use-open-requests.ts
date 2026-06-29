import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  declineSelectedJob,
  expressInterest,
  fetchOpenRequests,
  fetchRequestInterests,
  selectArtisan,
  withdrawInterest,
} from "@/features/open-requests/services/open-requests.service";
import { queryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useAuthSession } from "@/providers/auth-provider";

export function useOpenRequests() {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: queryKeys.openRequests.list(session?.user.id),
    queryFn: fetchOpenRequests,
    enabled: Boolean(session?.user.id),
  });
}

export function useRequestInterests(requestId?: string) {
  return useQuery({
    queryKey: queryKeys.requestInterests.list(requestId),
    queryFn: () => fetchRequestInterests(requestId!),
    enabled: Boolean(requestId),
  });
}

export function useExpressInterest() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: expressInterest,
    onSuccess: async (_, requestId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.openRequests.list(session?.user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.requestInterests.list(requestId),
        }),
      ]);
    },
  });
}

export function useWithdrawInterest() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: withdrawInterest,
    onSuccess: async (_, requestId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.openRequests.list(session?.user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.requestInterests.list(requestId),
        }),
      ]);
    },
  });
}

export function useSelectArtisan() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: ({ requestId, artisanId }: { requestId: string; artisanId: string }) =>
      selectArtisan(requestId, artisanId),
    onSuccess: async (_, { requestId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.customerRequests.list(session?.user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.customerRequests.detail(requestId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.requestInterests.list(requestId),
        }),
      ]);
    },
  });
}

export function useDeclineSelectedJob() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason?: string }) =>
      declineSelectedJob(requestId, reason),
    onSuccess: async (_, { requestId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.artisanJobs.list(session?.user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.artisanJobs.detail(requestId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.openRequests.list(session?.user.id),
        }),
      ]);
    },
  });
}

export function useOpenRequestsRealtime() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`open-requests:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "request_artisan_interests",
          filter: `artisan_id=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.openRequests.list(userId),
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);
}

/** Live updates for request_artisan_interests on a single booking. Mount once per booking route group. */
export function useRequestInterestsRealtime(requestId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`request-interests:${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "request_artisan_interests",
          filter: `request_id=eq.${requestId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.requestInterests.list(requestId),
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, requestId]);
}
