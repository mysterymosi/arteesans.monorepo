import { Alert, Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MenuButton } from "@/components/navigation";
import { Text } from "@/components/ui";
import {
  ArtisanJobRow,
  IncomingJobCard,
  isActiveArtisanJob,
  isIncomingAcceptanceJob,
  useArtisanJobs,
  useRejectJob,
} from "@/features/artisan-jobs";
import { useOpenRequests } from "@/features/open-requests";
import { icons } from "@/constants/icons";
import { artisanJobRoute, artisanOpenRequestsRoute, routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import type { VerificationStatus } from "@arteesans/shared";

type ArtisanHomeDashboardProps = {
  firstName: string;
  locationLabel: string;
  verificationStatus: VerificationStatus;
};

function StatCard({
  value,
  label,
  icon,
  iconBgClassName,
}: {
  value: string;
  label: string;
  icon: number;
  iconBgClassName: string;
}) {
  return (
    <View className="min-w-[87px] flex-1 rounded-xl border border-line/40 bg-surface p-2.5 shadow-sm">
      <View className="flex-row items-start justify-between gap-2">
        <View className="gap-1">
          <Text className="font-semibold text-sm text-ink">{value}</Text>
          <Text className="text-xs text-ink-secondary">{label}</Text>
        </View>
        <View className={cn("rounded-full p-1.5", iconBgClassName)}>
          <Image source={icon} style={{ width: 16, height: 16 }} contentFit="contain" />
        </View>
      </View>
    </View>
  );
}

/** Artisan home dashboard — Figma 36:2476 */
export function ArtisanHomeDashboard({
  firstName,
  locationLabel,
  verificationStatus,
}: ArtisanHomeDashboardProps) {
  const isApproved = verificationStatus === "approved";
  const greeting = firstName ? `Hello ${firstName},` : "Hello,";
  const { data: jobs = [] } = useArtisanJobs();
  const { data: openRequests = [] } = useOpenRequests();
  const rejectJob = useRejectJob();

  const incomingJob = jobs.find(isIncomingAcceptanceJob);
  const recentJobs = jobs
    .filter((job) => isActiveArtisanJob(job) && !isIncomingAcceptanceJob(job))
    .slice(0, 3);
  const completedCount = jobs.filter((job) => job.status === "completed").length;

  const handleRejectIncoming = () => {
    if (!incomingJob) return;
    Alert.alert("Decline job?", "This request will return to matching for another artisan.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: () => {
          rejectJob.mutate(
            { requestId: incomingJob.id },
            {
              onError: (error) => {
                Alert.alert(
                  "Could not decline job",
                  error instanceof Error ? error.message : "Please try again.",
                );
              },
            },
          );
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-8 px-5 pb-10 pt-4"
      className="flex-1 bg-surface"
    >
      <View className="flex-row items-center justify-between">
        <MenuButton />
        <View className="flex-row items-center gap-3">
          <Image source={icons.notificationNewDot} style={{ width: 16, height: 16 }} contentFit="contain" />
          <View className="h-[30px] w-[30px] rounded-full bg-surface-muted" />
        </View>
      </View>

      {!isApproved ? (
        <View className="rounded-2xl border border-warning/30 bg-warning-muted px-4 py-3">
          <Text className="font-medium text-sm text-ink">Application under review</Text>
          <Text className="mt-1 text-sm text-ink-secondary">
            Your documents are pending admin approval. You will be notified once verified and can
            start receiving jobs.
          </Text>
        </View>
      ) : null}

      <View className="gap-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-medium text-2xl text-ink">{greeting}</Text>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Update your location"
              onPress={() => router.push(routes.artisan.address)}
              className="mt-1 min-w-0 flex-row items-center gap-1 active:opacity-75"
            >
              <Image source={icons.location} style={{ width: 20, height: 20 }} contentFit="contain" />
              <Text
                className="min-w-0 text-base text-ink-secondary"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {locationLabel}
              </Text>
              <Image source={icons.chevronDown} style={{ width: 12, height: 12 }} contentFit="contain" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-1 rounded-full border border-success/40 bg-success-subtle px-2.5 py-1">
            <View className="h-3 w-3 rounded-full bg-success" />
            <Text className="font-medium text-base text-success">
              {isApproved ? "Available" : "Pending"}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <StatCard
            value="₦0"
            label="Today's earnings"
            icon={icons.orderApprove}
            iconBgClassName="bg-success-subtle"
          />
          <StatCard
            value={String(completedCount)}
            label="Jobs done"
            icon={icons.categories.repair}
            iconBgClassName="bg-primary-subtle"
          />
          <StatCard
            value="—"
            label="Rating"
            icon={icons.categories.hammer}
            iconBgClassName="bg-warning-subtle"
          />
        </View>
      </View>

      {isApproved ? (
        <>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(artisanOpenRequestsRoute())}
            className="rounded-2xl border border-primary/20 bg-primary-subtle px-4 py-4"
          >
            <Text className="font-medium text-base text-primary">Open requests near you</Text>
            <Text className="mt-1 text-sm text-ink-secondary">
              {openRequests.length > 0
                ? `${openRequests.length} matching request${openRequests.length === 1 ? "" : "s"} available`
                : "Browse new customer requests in your skill area"}
            </Text>
          </Pressable>

          {incomingJob ? (
            <View className="gap-5">
              <View className="flex-row items-center justify-between">
                <Text className="font-medium text-base text-ink">New Requests</Text>
                <Text className="font-light text-sm text-ink-secondary">Just now</Text>
              </View>
              <IncomingJobCard
                job={incomingJob}
                onReject={handleRejectIncoming}
                isRejecting={rejectJob.isPending}
              />
            </View>
          ) : null}

          <View className="gap-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-base text-ink">Recent Jobs</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push(routes.artisan.jobs)}>
                <Text className="font-semibold text-sm text-primary underline">See All</Text>
              </Pressable>
            </View>

            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <ArtisanJobRow
                  key={job.id}
                  job={job}
                  onPress={() => router.push(artisanJobRoute(job.id))}
                />
              ))
            ) : (
              <View className="rounded-2xl border border-line bg-surface-muted px-4 py-6">
                <Text className="text-center text-sm text-ink-secondary">
                  No active jobs yet. Browse open requests to express interest.
                </Text>
              </View>
            )}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}
