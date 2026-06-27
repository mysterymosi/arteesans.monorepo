import { Stack } from "expo-router";
import { useCustomerRequestsListRealtime } from "@/features/service-requests";

export default function CustomerStackLayout() {
  useCustomerRequestsListRealtime();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
