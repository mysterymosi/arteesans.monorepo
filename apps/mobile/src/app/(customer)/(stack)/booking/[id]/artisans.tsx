import { FlatList, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button, ScreenHeader, Text } from "@/components/ui";
import { InterestArtisanRow, useRequestInterests } from "@/features/open-requests";
import { useCustomerRequest } from "@/features/service-requests";
import { customerBookingArtisanRoute, customerBookingRoute } from "@/lib/routes";

export default function CustomerBookingArtisansScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: request, isLoading: requestLoading } = useCustomerRequest(id);
  const { data: interests = [], isLoading: interestsLoading } = useRequestInterests(id);

  if (requestLoading || interestsLoading) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Choose artisan" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading artisans...</Text>
        </View>
      </View>
    );
  }

  if (!request || request.status !== "matching") {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Choose artisan" />
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-center text-ink-secondary">
            This booking is no longer accepting artisan interest.
          </Text>
          <Button
            title="Back to booking"
            variant="outline"
            onPress={() => router.canGoBack() ? router.back() : router.replace(customerBookingRoute(id))}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Choose artisan" />
      {interests.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-5">
          <Text className="text-center font-medium text-base text-ink">Waiting for artisans</Text>
          <Text className="text-center text-sm text-ink-secondary">
            Eligible artisans can express interest in your request. You will see them here as they
            apply.
          </Text>
        </View>
      ) : (
        <FlatList
          data={interests}
          keyExtractor={(item) => item.interest_id}
          contentContainerClassName="gap-3 px-5 pb-10"
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => (
            <InterestArtisanRow
              interest={item}
              onPress={() => router.push(customerBookingArtisanRoute(id, item.artisan_id))}
            />
          )}
        />
      )}
    </View>
  );
}
