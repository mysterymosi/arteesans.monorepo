import { useQuery } from "@tanstack/react-query";
import {
  fetchCustomerRequest,
  fetchCustomerRequests,
} from "@/features/service-requests/services/requests.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

export function useCustomerRequests() {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: queryKeys.customerRequests.list(session?.user.id),
    enabled: Boolean(session?.user.id),
    queryFn: fetchCustomerRequests,
  });
}

export function useCustomerRequest(requestId: string | undefined) {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: queryKeys.customerRequests.detail(requestId),
    enabled: Boolean(session?.user.id && requestId),
    queryFn: () => fetchCustomerRequest(requestId!),
  });
}
