import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button, ScreenHeader, Text } from "@/components/ui";
import { JobStatusStepper, useArtisanJob, useUpdateJobStatus } from "@/features/artisan-jobs";
import { artisanJobCompleteRoute } from "@/lib/routes";
import { getNextArtisanJobStatus } from "@arteesans/shared";

export default function ArtisanJobTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: job, isLoading, isError } = useArtisanJob(id);
  const updateStatus = useUpdateJobStatus();

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Active tracking" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading job...</Text>
        </View>
      </View>
    );
  }

  if (isError || !job) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Active tracking" />
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-center text-ink-secondary">
            {isError
              ? "Could not load this job. Please try again."
              : "This job is no longer available."}
          </Text>
          <Button title="Go back" variant="outline" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const nextStatus =
    job.status === "in_progress" ? null : getNextArtisanJobStatus(job.status);
  const nextLabel = nextStatus ? nextStatus.replaceAll("_", " ") : null;

  const handleAdvance = async () => {
    if (!nextStatus) return;

    try {
      await updateStatus.mutateAsync({ requestId: job.id, status: nextStatus });
    } catch (error) {
      Alert.alert(
        "Could not update status",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Active tracking" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-10"
      >
        <Text className="text-sm text-ink-secondary">
          Update the customer as you progress through the job.
        </Text>
        <JobStatusStepper status={job.status} />
        {job.status === "in_progress" ? (
          <Button
            title="Mark job complete"
            onPress={() => router.push(artisanJobCompleteRoute(job.id))}
          />
        ) : nextStatus ? (
          <Button
            title={`Mark as ${nextLabel}`}
            loading={updateStatus.isPending}
            onPress={handleAdvance}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}
