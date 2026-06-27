import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  confirmBooking,
  confirmJobCompletion,
} from "@/features/service-requests/services/booking-actions.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

function useInvalidateCustomerRequests() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return async (requestId?: string) => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.customerRequests.list(session?.user.id),
    });
    if (requestId) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customerRequests.detail(requestId),
      });
    }
  };
}

export function useConfirmBooking() {
  const invalidate = useInvalidateCustomerRequests();

  return useMutation({
    mutationFn: confirmBooking,
    onSuccess: async (_, requestId) => {
      await invalidate(requestId);
    },
  });
}

export function useConfirmJobCompletion() {
  const invalidate = useInvalidateCustomerRequests();

  return useMutation({
    mutationFn: confirmJobCompletion,
    onSuccess: async (_, requestId) => {
      await invalidate(requestId);
    },
  });
}
