import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptJob,
  attachCompletionMedia,
  fetchArtisanJob,
  fetchArtisanJobs,
  rejectJob,
  updateJobStatus,
} from "@/features/artisan-jobs/services/artisan-jobs.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";
import type { RequestStatus } from "@arteesans/shared";

export function useArtisanJobs() {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: queryKeys.artisanJobs.list(session?.user.id),
    enabled: Boolean(session?.user.id),
    queryFn: fetchArtisanJobs,
  });
}

export function useArtisanJob(requestId: string | undefined) {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: queryKeys.artisanJobs.detail(requestId),
    enabled: Boolean(session?.user.id && requestId),
    queryFn: () => fetchArtisanJob(requestId!),
  });
}

function useInvalidateArtisanJobs() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return async (requestId?: string) => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.artisanJobs.list(session?.user.id),
    });
    if (requestId) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.artisanJobs.detail(requestId),
      });
    }
  };
}

export function useAcceptJob() {
  const invalidate = useInvalidateArtisanJobs();

  return useMutation({
    mutationFn: acceptJob,
    onSuccess: async (_, requestId) => {
      await invalidate(requestId);
    },
  });
}

export function useRejectJob() {
  const invalidate = useInvalidateArtisanJobs();

  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason?: string }) =>
      rejectJob(requestId, reason),
    onSuccess: async (_, { requestId }) => {
      await invalidate(requestId);
    },
  });
}

export function useUpdateJobStatus() {
  const invalidate = useInvalidateArtisanJobs();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: RequestStatus;
    }) => updateJobStatus(requestId, status),
    onSuccess: async (_, { requestId }) => {
      await invalidate(requestId);
    },
  });
}

export function useAttachCompletionMedia() {
  const invalidate = useInvalidateArtisanJobs();

  return useMutation({
    mutationFn: ({
      requestId,
      paths,
    }: {
      requestId: string;
      paths: string[];
    }) => attachCompletionMedia(requestId, paths),
    onSuccess: async (_, { requestId }) => {
      await invalidate(requestId);
    },
  });
}
