import { ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Avatar, Button, ScreenHeader, Text } from "@/components/ui";
import { useCustomerRequest } from "@/features/service-requests";
import { formatPersonName } from "@/lib/format";
import { customerBookingTrackingRoute } from "@/lib/routes";

export default function CustomerBookingArtisanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: request, isLoading, isError } = useCustomerRequest(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Artisan profile" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading artisan...</Text>
        </View>
      </View>
    );
  }

  if (isError || !request?.artisan) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Artisan profile" />
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-center text-ink-secondary">
            {isError ? "Could not load artisan details." : "No artisan is assigned yet."}
          </Text>
          <Button title="Go back" variant="outline" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const artisanName = formatPersonName(
    request.artisan.first_name,
    request.artisan.last_name,
  );

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Artisan profile" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-10"
      >
        <View className="items-center gap-4 rounded-2xl border border-line bg-surface-muted px-5 py-8">
          <Avatar uri={request.artisan.profile_photo_url} name={artisanName} size={88} />
          <View className="items-center gap-1">
            <Text className="font-semibold text-xl text-ink">{artisanName}</Text>
            <Text className="text-sm text-ink-secondary">Verified artisan</Text>
          </View>
        </View>

        <View className="gap-3 rounded-2xl border border-line bg-surface-muted p-4">
          <Text className="font-medium text-sm text-ink">Assigned service</Text>
          <Text className="text-sm text-ink-secondary">
            {request.category?.name ?? "Service"} at {request.address}
          </Text>
        </View>

        <Button
          title="Track this job"
          onPress={() => router.push(customerBookingTrackingRoute(request.id))}
        />
      </ScrollView>
    </View>
  );
}
