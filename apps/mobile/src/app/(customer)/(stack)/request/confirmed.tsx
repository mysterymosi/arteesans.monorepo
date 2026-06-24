import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUrgencyLabel } from "@arteesans/shared";
import { Text } from "@/components/ui";
import { useCustomerRequest } from "@/features/service-requests";
import { formatNaira } from "@/lib/format";
import { routes } from "@/lib/routes";
import { colors } from "@/theme";

/** Confirmed request (Figma 8:2206). */
export default function RequestConfirmedScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const { data: request, isLoading } = useCustomerRequest(requestId);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(routes.customer.bookings);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !request) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const categoryName = request.category?.name ?? "Service";

  return (
    <SafeAreaView className="flex-1 bg-surface px-6">
      <View className="flex-1 items-center justify-center">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-success-muted">
          <Text className="text-3xl text-success">✓</Text>
        </View>

        <Text className="mt-6 font-semibold text-2xl text-ink">Request Received!</Text>
        <Text className="mt-2 text-center text-base text-ink-secondary">
          We are finding the best artisan for your {categoryName.toLowerCase()} job.
        </Text>

        <View className="mt-10 w-full gap-4 px-4">
          <SummaryRow label="Category" value={categoryName} />
          <SummaryRow label="Urgency" value={getUrgencyLabel(request.urgency)} />
          <SummaryRow label="Budget" value={formatNaira(request.budget)} />
        </View>
      </View>

      <Text className="pb-8 text-center text-sm text-ink-secondary">
        Redirecting to your bookings...
      </Text>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base text-ink-secondary">{label}</Text>
      <Text className="font-semibold text-base text-ink">{value}</Text>
    </View>
  );
}
