import { Stack, useLocalSearchParams } from "expo-router";
import { useRequestInterestsRealtime } from "@/features/open-requests";

export default function CustomerBookingLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useRequestInterestsRealtime(id);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
