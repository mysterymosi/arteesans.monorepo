import { Alert, Linking, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useMemo } from "react";
import { Button, ScreenHeader, Text } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";
import {
  useAcceptJob,
  useArtisanJob,
  useRejectJob,
} from "@/features/artisan-jobs";
import { useDeclineSelectedJob } from "@/features/open-requests";
import { getUrgencyLabel } from "@/features/artisan-jobs/types/artisan-job";
import { formatNaira, formatPersonName } from "@/lib/format";
import { artisanJobCompleteRoute, artisanJobTrackingRoute } from "@/lib/routes";
import { JOB_ACCEPT_TIMEOUT_MINUTES } from "@arteesans/shared";

export default function ArtisanJobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: job, isLoading, isError } = useArtisanJob(id);
  const acceptJob = useAcceptJob();
  const rejectJob = useRejectJob();
  const declineSelectedJob = useDeclineSelectedJob();

  const minutesRemaining = useMemo(() => {
    if (!job?.accept_deadline_at) return null;
    const deadline = new Date(job.accept_deadline_at).getTime();
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) return 0;
    return Math.ceil(remainingMs / 60_000);
  }, [job?.accept_deadline_at]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Job details" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-secondary">Loading job...</Text>
        </View>
      </View>
    );
  }

  if (isError || !job) {
    return (
      <View className="flex-1 bg-surface">
        <ScreenHeader title="Job details" />
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

  const categoryName = job.category?.name ?? "Service";
  const categorySlug = job.category?.slug ?? "general-repairs";
  const customerName = formatPersonName(job.customer?.first_name, job.customer?.last_name);
  const canAccept = job.status === "confirmed";
  const canDeclineSelected = job.status === "accepted";
  const canTrack = ["accepted", "on_the_way", "arrived", "in_progress"].includes(job.status);

  const handleAccept = async () => {
    try {
      await acceptJob.mutateAsync(job.id);
      router.replace(artisanJobTrackingRoute(job.id));
    } catch (error) {
      Alert.alert(
        "Could not accept job",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const handleDeclineSelected = () => {
    Alert.alert("Decline job?", "This request will return to matching for the customer.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          try {
            await declineSelectedJob.mutateAsync({ requestId: job.id });
            router.back();
          } catch (error) {
            Alert.alert(
              "Could not decline job",
              error instanceof Error ? error.message : "Please try again.",
            );
          }
        },
      },
    ]);
  };

  const handleReject = () => {
    Alert.alert("Decline job?", "This request will return to matching for another artisan.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          try {
            await rejectJob.mutateAsync({ requestId: job.id });
            router.back();
          } catch (error) {
            Alert.alert(
              "Could not decline job",
              error instanceof Error ? error.message : "Please try again.",
            );
          }
        },
      },
    ]);
  };

  const handleCall = () => {
    const phone = job.customer?.phone;
    if (!phone) {
      Alert.alert("Phone unavailable", "Customer phone number is not on file.");
      return;
    }
    void Linking.openURL(`tel:${phone}`);
  };

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Job details" />
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
            <Text className="text-sm text-ink-secondary">{getUrgencyLabel(job.urgency)}</Text>
          </View>
          <Text className="font-semibold text-base text-primary">{formatNaira(job.budget)}</Text>
        </View>

        <View className="gap-2 rounded-2xl border border-line bg-surface-muted p-4">
          <Text className="font-medium text-sm text-ink">{customerName}</Text>
          <Text className="text-sm text-ink-secondary">{job.address}</Text>
          <Text className="text-sm leading-5 text-ink">{job.description}</Text>
        </View>

        {job.status === "matched" ? (
          <View className="rounded-2xl border border-primary/20 bg-primary-subtle px-4 py-3">
            <Text className="font-medium text-sm text-primary">Waiting for customer confirmation</Text>
            <Text className="mt-1 text-sm text-ink-secondary">
              You will be able to accept or decline once the customer confirms this booking.
            </Text>
          </View>
        ) : null}

        {canAccept ? (
          <View className="gap-3">
            {minutesRemaining != null ? (
              <Text className="text-center text-sm text-ink-secondary">
                Accept within {minutesRemaining} min (timeout {JOB_ACCEPT_TIMEOUT_MINUTES} min)
              </Text>
            ) : null}
            <Button
              title="Accept job"
              loading={acceptJob.isPending}
              onPress={handleAccept}
            />
            <Button
              title="Decline job"
              variant="outline"
              loading={rejectJob.isPending}
              onPress={handleReject}
            />
          </View>
        ) : null}

        {canDeclineSelected ? (
          <Button
            title="Decline job"
            variant="outline"
            loading={declineSelectedJob.isPending}
            onPress={handleDeclineSelected}
          />
        ) : null}

        {canTrack ? (
          <Button
            title="Open job tracking"
            onPress={() => router.push(artisanJobTrackingRoute(job.id))}
          />
        ) : null}

        {job.status === "in_progress" ? (
          <Button
            title="Mark job complete"
            onPress={() => router.push(artisanJobCompleteRoute(job.id))}
          />
        ) : null}

        {job.customer?.phone ? (
          <Button title="Call customer" variant="secondary" onPress={handleCall} />
        ) : null}
      </ScrollView>
    </View>
  );
}
