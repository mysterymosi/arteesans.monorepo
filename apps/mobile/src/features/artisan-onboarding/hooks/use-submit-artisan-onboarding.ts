import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitArtisanOnboarding,
  type SubmitOnboardingInput,
} from "@/features/artisan-onboarding/services/onboarding.service";
import type { ArtisanProfileRow } from "@/features/artisan-onboarding/services/artisan-profile.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

export type SubmitArtisanOnboardingMutationInput = Omit<SubmitOnboardingInput, "userId">;

export function useSubmitArtisanOnboardingMutation() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();

  return useMutation({
    mutationFn: async (
      input: SubmitArtisanOnboardingMutationInput,
    ): Promise<ArtisanProfileRow> => {
      const userId = session?.user.id;
      if (!userId) {
        throw new Error("You are not signed in.");
      }

      const result = await submitArtisanOnboarding({ ...input, userId });
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.profile) {
        throw new Error("Could not load artisan profile after save.");
      }

      return result.profile;
    },
    onSuccess: () => {
      const userId = session?.user.id;
      if (!userId) return;

      void queryClient.invalidateQueries({
        queryKey: queryKeys.artisanOnboarding.detail(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.artisanProfile.detail(userId),
      });
    },
  });
}
