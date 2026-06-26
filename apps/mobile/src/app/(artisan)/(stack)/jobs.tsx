import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ScreenHeader, Text } from "@/components/ui";
import {
  ArtisanJobRow,
  isActiveArtisanJob,
  useArtisanJobs,
} from "@/features/artisan-jobs";
import { artisanJobRoute } from "@/lib/routes";

/** Artisan jobs list — Figma 36:3573 */
export default function ArtisanJobsScreen() {
  const { data: jobs = [], isLoading } = useArtisanJobs();
  const activeJobs = jobs.filter(isActiveArtisanJob);
  const completedJobs = jobs.filter((job) => job.status === "completed");

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Jobs" showBack={false} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-10"
      >
        <View className="gap-3">
          <Text className="font-medium text-base text-ink">Active</Text>
          {isLoading ? (
            <Text className="text-sm text-ink-secondary">Loading jobs...</Text>
          ) : activeJobs.length > 0 ? (
            activeJobs.map((job) => (
              <ArtisanJobRow
                key={job.id}
                job={job}
                onPress={() => router.push(artisanJobRoute(job.id))}
              />
            ))
          ) : (
            <Text className="text-sm text-ink-secondary">No active jobs.</Text>
          )}
        </View>

        <View className="gap-3">
          <Text className="font-medium text-base text-ink">Completed</Text>
          {isLoading ? (
            <Text className="text-sm text-ink-secondary">Loading jobs...</Text>
          ) : completedJobs.length > 0 ? (
            completedJobs.map((job) => (
              <ArtisanJobRow
                key={job.id}
                job={job}
                onPress={() => router.push(artisanJobRoute(job.id))}
              />
            ))
          ) : (
            <Text className="text-sm text-ink-secondary">No completed jobs yet.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
