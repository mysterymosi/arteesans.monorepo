import { Alert, FlatList, View } from "react-native";
import { router } from "expo-router";
import { Button, ScreenHeader, Text } from "@/components/ui";
import {
  OpenRequestRow,
  useExpressInterest,
  useOpenRequests,
  useWithdrawInterest,
} from "@/features/open-requests";

export default function ArtisanOpenRequestsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useOpenRequests();
  const requests = data ?? [];
  const expressInterest = useExpressInterest();
  const withdrawInterest = useWithdrawInterest();

  const handlePress = (requestId: string, interestStatus: string | null) => {
    if (expressInterest.isPending || withdrawInterest.isPending) return;
    if (interestStatus === "pending") {
      Alert.alert("Withdraw interest?", "You can express interest again later.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          style: "destructive",
          onPress: () => {
            withdrawInterest.mutate(requestId, {
              onError: (error) => {
                Alert.alert(
                  "Could not withdraw",
                  error instanceof Error ? error.message : "Please try again.",
                );
              },
            });
          },
        },
      ]);
      return;
    }

    expressInterest.mutate(requestId, {
      onSuccess: () => {
        Alert.alert("Interest submitted", "The customer will be notified.");
      },
      onError: (error) => {
        Alert.alert(
          "Could not express interest",
          error instanceof Error ? error.message : "Please try again.",
        );
      },
    });
  };

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Open requests" />
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading open requests...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 px-5">
          <Text className="text-center font-medium text-base text-ink">
            Could not load open requests
          </Text>
          <Text className="text-center text-sm text-ink-secondary">
            Please check your connection and try again.
          </Text>
          <Button
            title="Try again"
            onPress={() => void refetch()}
            loading={isRefetching}
          />
          <Button title="Go back" variant="outline" onPress={() => router.back()} />
        </View>
      ) : requests.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-5">
          <Text className="text-center font-medium text-base text-ink">No open requests</Text>
          <Text className="text-center text-sm text-ink-secondary">
            New matching requests in your skill area will appear here.
          </Text>
          <Button title="View my jobs" variant="outline" onPress={() => router.back()} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.request_id}
          contentContainerClassName="gap-3 px-5 pb-10"
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => (
            <OpenRequestRow
              request={item}
              onPress={() => handlePress(item.request_id, item.interest_status)}
            />
          )}
        />
      )}
    </View>
  );
}
