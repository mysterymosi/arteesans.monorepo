import { Stack } from "expo-router";
import { useArtisanJobsRealtime } from "@/features/artisan-jobs";
import { useOpenRequestsRealtime } from "@/features/open-requests";

export default function ArtisanStackLayout() {
  useArtisanJobsRealtime();
  useOpenRequestsRealtime();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
