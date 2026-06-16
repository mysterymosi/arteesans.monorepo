import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  type CreateServiceRequestInput,
} from "@/features/service-requests/services/create-request.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

export type { CreateServiceRequestInput };

export function useCreateServiceRequestMutation() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: async (input: CreateServiceRequestInput): Promise<string> => {
      const userId = session?.user.id;
      if (!userId) {
        throw new Error("You must be signed in to submit a request.");
      }

      return createServiceRequest(userId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerRequests.all });
    },
  });
}
