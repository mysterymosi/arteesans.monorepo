import { useQuery } from "@tanstack/react-query";
import { fetchArtisanProfile } from "@/features/artisan-onboarding/services/artisan-profile.service";
import { queryKeys } from "@/lib/query-keys";

export function useArtisanProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.artisanProfile.detail(userId),
    queryFn: () => fetchArtisanProfile(userId!),
    enabled: Boolean(userId),
  });
}
