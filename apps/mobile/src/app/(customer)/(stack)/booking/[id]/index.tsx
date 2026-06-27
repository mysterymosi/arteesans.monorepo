import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button, ScreenHeader, Text } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";
import {
  isAwaitingCustomerConfirmation,
  useConfirmBooking,
  useConfirmJobCompletion,
  useCustomerRequest,
} from "@/features/service-requests";
import { getUrgencyLabel } from "@/features/artisan-jobs/types/artisan-job";
import { formatNaira, formatPersonName } from "@/lib/format";
import {
  customerBookingArtisanRoute,
  customerBookingTrackingRoute,
  routes,
} from "@/lib/routes";

export default function CustomerBookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: request, isLoading, isError } = useCustomerRequest(id);
  const confirmBooking = useConfirmBooking();
  const confirmCompletion = useConfirmJobCompletion();

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Booking details" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading booking...</Text>
        </View>
      </View>
    );
  }

  if (isError || !request) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Booking details" />
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-center text-ink-secondary">
            {isError ? "Could not load this booking." : "This booking is no longer available."}
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

  const categoryName = request.category?.name ?? "Service";
  const categorySlug = request.category?.slug ?? "general-repairs";
  const artisanName = request.artisan
    ? formatPersonName(request.artisan.first_name, request.artisan.last_name)
    : null;
  const canConfirmBooking = request.status === "matched";
  const canTrack = [
    "confirmed",
    "accepted",
    "on_the_way",
    "arrived",
    "in_progress",
    "completed",
  ].includes(request.status);
  const awaitingConfirmation = isAwaitingCustomerConfirmation(request);

  const handleConfirmBooking = async () => {
    try {
      await confirmBooking.mutateAsync(request.id);
      router.push(customerBookingTrackingRoute(request.id));
    } catch (error) {
      Alert.alert(
        "Could not confirm booking",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const handleConfirmCompletion = async () => {
    try {
      await confirmCompletion.mutateAsync(request.id);
      router.back();
    } catch (error) {
      Alert.alert(
        "Could not confirm completion",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const handleCall = () => {
    Alert.alert("Phone unavailable", "Artisan phone number is not available in the app yet.");
  };

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Booking details" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-5 px-5 pb-10"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-muted">
            <CategoryIcon slug={categorySlug} size={22} />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-lg text-ink">{categoryName}</Text>
            <Text className="text-sm text-ink-secondary">{getUrgencyLabel(request.urgency)}</Text>
          </View>
          <Text className="font-semibold text-base text-primary">{formatNaira(request.budget)}</Text>
        </View>

        <View className="gap-2 rounded-2xl border border-line bg-surface-muted p-4">
          <Text className="font-medium text-sm text-ink">Service address</Text>
          <Text className="text-sm text-ink-secondary">{request.address}</Text>
          <Text className="text-sm leading-5 text-ink">{request.description}</Text>
        </View>

        {artisanName ? (
          <Button
            title={`View ${artisanName}`}
            variant="outline"
            onPress={() => router.push(customerBookingArtisanRoute(request.id))}
          />
        ) : null}

        {request.status === "matched" ? (
          <View className="rounded-2xl border border-primary/20 bg-primary-subtle px-4 py-3">
            <Text className="font-medium text-sm text-primary">Artisan matched</Text>
            <Text className="mt-1 text-sm text-ink-secondary">
              Confirm this booking so your artisan can accept and start the job.
            </Text>
          </View>
        ) : null}

        {canConfirmBooking ? (
          <Button
            title="Confirm booking"
            loading={confirmBooking.isPending}
            onPress={handleConfirmBooking}
          />
        ) : null}

        {canTrack ? (
          <Button
            title="Track job"
            variant={canConfirmBooking ? "outline" : "primary"}
            onPress={() => router.push(customerBookingTrackingRoute(request.id))}
          />
        ) : null}

        {awaitingConfirmation ? (
          <Button
            title="Confirm completion"
            loading={confirmCompletion.isPending}
            onPress={handleConfirmCompletion}
          />
        ) : null}

        {request.customer_confirmed_at ? (
          <View className="rounded-2xl border border-success/20 bg-success-subtle px-4 py-3">
            <Text className="font-medium text-sm text-success">Job closed</Text>
            <Text className="mt-1 text-sm text-ink-secondary">
              You confirmed completion on{" "}
              {new Date(request.customer_confirmed_at).toLocaleString()}.
            </Text>
          </View>
        ) : null}

        {request.status !== "matched" ? (
          <Button title="Call artisan" variant="secondary" onPress={handleCall} />
        ) : null}
      </ScrollView>
    </View>
  );
}
