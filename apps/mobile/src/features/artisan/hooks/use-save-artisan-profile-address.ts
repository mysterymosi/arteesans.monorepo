import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveArtisanProfileAddress,
  type SaveArtisanProfileAddressInput,
} from "@/features/artisan/services/address.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

export function useSaveArtisanProfileAddress() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: (input: SaveArtisanProfileAddressInput) =>
      saveArtisanProfileAddress(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.artisanProfile.detail(session?.user.id),
      });
    },
  });
}
