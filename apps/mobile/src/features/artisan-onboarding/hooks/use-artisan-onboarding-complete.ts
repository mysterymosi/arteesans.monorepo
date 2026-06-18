import { useQuery } from "@tanstack/react-query";
import { isArtisanOnboardingComplete } from "@/features/artisan-onboarding/services/artisan-profile.service";
import { queryKeys } from "@/lib/query-keys";

export function useArtisanOnboardingComplete(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.artisanOnboarding.detail(userId),
    queryFn: () => isArtisanOnboardingComplete(userId!),
    enabled: Boolean(userId),
  });
}
