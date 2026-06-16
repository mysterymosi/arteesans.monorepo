import { useQuery } from "@tanstack/react-query";
import { fetchCustomerDefaultAddress } from "@/features/customer/services/address.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

export function useCustomerDefaultAddress() {
  const { session } = useAuthSession();

  return useQuery({
    queryKey: queryKeys.customerDefaultAddress.detail(session?.user.id),
    enabled: Boolean(session?.user.id),
    queryFn: fetchCustomerDefaultAddress,
  });
}
