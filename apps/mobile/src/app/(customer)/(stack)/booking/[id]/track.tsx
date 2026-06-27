import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button, ScreenHeader, Text } from "@/components/ui";
import {
  CustomerJobStatusStepper,
  isAwaitingCustomerConfirmation,
  useConfirmJobCompletion,
  useCustomerRequest,
} from "@/features/service-requests";
import { formatNaira } from "@/lib/format";
import { customerBookingRoute, routes } from "@/lib/routes";

export default function CustomerBookingTrackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: request, isLoading, isError } = useCustomerRequest(id);
  const confirmCompletion = useConfirmJobCompletion();

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Track job" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading job...</Text>
        </View>
      </View>
    );
  }

  if (isError || !request) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Track job" />
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-center text-ink-secondary">
            {isError ? "Could not load this job." : "This job is no longer available."}
          </Text>
          <Button
            title="Go back"
            variant="outline"
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace(routes.customer.bookings)
            }
          />
        </View>
      </View>
    );
  }

  const awaitingConfirmation = isAwaitingCustomerConfirmation(request);
  const trackingStatus =
    request.status === "confirmed" || request.status === "matched"
      ? "accepted"
      : request.status;
  const showPreAcceptance =
    request.status === "matched" || request.status === "confirmed";

  const handleConfirmCompletion = async () => {
    try {
      await confirmCompletion.mutateAsync(request.id);
      router.replace(customerBookingRoute(request.id));
    } catch (error) {
      Alert.alert(
        "Could not confirm completion",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Track job" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-10"
      >
        <View className="rounded-2xl border border-line bg-surface-muted p-4">
          <Text className="font-medium text-sm text-ink">
            {request.category?.name ?? "Service"}
          </Text>
          <Text className="mt-1 text-sm text-ink-secondary">{request.address}</Text>
          <Text className="mt-3 font-semibold text-base text-primary">
            {formatNaira(request.budget)}
          </Text>
        </View>

        {showPreAcceptance ? (
          <View className="rounded-2xl border border-line bg-surface-muted px-4 py-3">
            <Text className="font-medium text-sm text-ink">
              {request.status === "matched"
                ? "Waiting for your booking confirmation"
                : "Waiting for artisan acceptance"}
            </Text>
            <Text className="mt-1 text-sm text-ink-secondary">
              {request.status === "matched"
                ? "Confirm the booking from booking details to notify your artisan."
                : "Your artisan has been notified and can accept within 15 minutes."}
            </Text>
          </View>
        ) : (
          <CustomerJobStatusStepper
            status={trackingStatus}
            awaitingCustomerConfirmation={awaitingConfirmation}
          />
        )}

        {awaitingConfirmation ? (
          <Button
            title="Confirm completion"
            loading={confirmCompletion.isPending}
            onPress={handleConfirmCompletion}
          />
        ) : null}

        <Button
          title="Booking details"
          variant="outline"
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace(customerBookingRoute(request.id))
          }
        />
      </ScrollView>
    </View>
  );
}
