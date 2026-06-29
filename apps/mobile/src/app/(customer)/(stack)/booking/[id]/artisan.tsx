import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Avatar, Button, ScreenHeader, Text } from "@/components/ui";
import {
  useRequestInterests,
  useSelectArtisan,
} from "@/features/open-requests";
import { useCustomerRequest } from "@/features/service-requests";
import { formatPersonName } from "@/lib/format";
import { customerBookingTrackingRoute } from "@/lib/routes";

export default function CustomerBookingArtisanScreen() {
  const { id, artisanId } = useLocalSearchParams<{ id: string; artisanId?: string }>();
  const { data: request, isLoading, isError } = useCustomerRequest(id);
  const { data: interests = [] } = useRequestInterests(id);
  const selectArtisan = useSelectArtisan();

  const interestProfile = artisanId
    ? interests.find((interest) => interest.artisan_id === artisanId)
    : null;
  const assignedArtisan = request?.artisan;
  const profile = interestProfile
    ? {
        id: interestProfile.artisan_id,
        first_name: interestProfile.first_name,
        last_name: interestProfile.last_name,
        profile_photo_url: interestProfile.profile_photo_url,
        average_rating: interestProfile.average_rating,
        completed_jobs: interestProfile.completed_jobs,
        city_lga: interestProfile.city_lga,
        state: interestProfile.state,
      }
    : assignedArtisan
      ? {
          id: assignedArtisan.id,
          first_name: assignedArtisan.first_name,
          last_name: assignedArtisan.last_name,
          profile_photo_url: assignedArtisan.profile_photo_url,
          average_rating: null,
          completed_jobs: null,
          city_lga: null,
          state: null,
        }
      : null;

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

  if (isError || !request || !profile) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Artisan profile" />
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-center text-ink-secondary">
            {isError ? "Could not load artisan details." : "No artisan is available yet."}
          </Text>
          <Button title="Go back" variant="outline" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const artisanName = formatPersonName(profile.first_name, profile.last_name);
  const location = [profile.city_lga, profile.state].filter(Boolean).join(", ");
  const canSelect = request.status === "matching" && Boolean(interestProfile);

  const handleSelectArtisan = async () => {
    try {
      await selectArtisan.mutateAsync({ requestId: request.id, artisanId: profile.id });
      router.replace(customerBookingTrackingRoute(request.id));
    } catch (error) {
      Alert.alert(
        "Could not select artisan",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Artisan profile" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-10"
      >
        <View className="items-center gap-4 rounded-2xl border border-line bg-surface-muted px-5 py-8">
          <Avatar uri={profile.profile_photo_url} name={artisanName} size={88} />
          <View className="items-center gap-1">
            <Text className="font-semibold text-xl text-ink">{artisanName}</Text>
            <Text className="text-sm text-ink-secondary">Verified artisan</Text>
            {profile.average_rating != null ? (
              <Text className="text-sm text-ink-secondary">
                {profile.average_rating.toFixed(1)} rating · {profile.completed_jobs ?? 0} jobs
              </Text>
            ) : null}
            {location ? <Text className="text-sm text-ink-secondary">{location}</Text> : null}
          </View>
        </View>

        <View className="gap-3 rounded-2xl border border-line bg-surface-muted p-4">
          <Text className="font-medium text-sm text-ink">Service</Text>
          <Text className="text-sm text-ink-secondary">
            {request.category?.name ?? "Service"} at {request.address}
          </Text>
        </View>

        {canSelect ? (
          <Button
            title="Select this artisan"
            loading={selectArtisan.isPending}
            onPress={handleSelectArtisan}
          />
        ) : (
          <Button
            title="Track this job"
            onPress={() => router.push(customerBookingTrackingRoute(request.id))}
          />
        )}
      </ScrollView>
    </View>
  );
}
