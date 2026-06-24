import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveCustomerDefaultAddress,
  type SaveCustomerDefaultAddressInput,
} from "@/features/customer/services/address.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

export function useSaveCustomerDefaultAddress() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: (input: SaveCustomerDefaultAddressInput) =>
      saveCustomerDefaultAddress(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.customerDefaultAddress.detail(session?.user.id),
      });
    },
  });
}
