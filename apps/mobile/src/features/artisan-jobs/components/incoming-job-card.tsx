import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Button, Text } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";
import { getArtisanJobStatusLabel, getUrgencyLabel, type ArtisanJob } from "@/features/artisan-jobs/types/artisan-job";
import { formatNaira, formatPersonName, formatRequestDate } from "@/lib/format";
import { artisanJobRoute } from "@/lib/routes";
import { colors } from "@/theme";
import { cn } from "@/lib/cn";
import { icons } from "@/constants/icons";

type IncomingJobCardProps = {
  job: ArtisanJob;
  onReject?: () => void;
  isRejecting?: boolean;
};

export function IncomingJobCard({ job, onReject, isRejecting }: IncomingJobCardProps) {
  const categoryName = job.category?.name ?? "Service";
  const customerName = formatPersonName(job.customer?.first_name, job.customer?.last_name);

  return (
    <View className="gap-3 rounded-[20px] bg-surface-muted p-5 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <View
            className={cn(
              "rounded-full px-2.5 py-1",
              job.urgency === "emergency" ? "bg-danger-subtle" : "bg-primary-subtle",
            )}
          >
            <Text
              className={cn(
                "font-medium text-sm",
                job.urgency === "emergency" ? "text-danger" : "text-primary",
              )}
            >
              {getUrgencyLabel(job.urgency)}
            </Text>
          </View>
          <Text className="text-base text-ink-secondary">{categoryName}</Text>
        </View>
        <Text className="font-semibold text-base text-primary">{formatNaira(job.budget)}</Text>
      </View>

      <View>
        <Text className="font-medium text-sm text-ink">{customerName}</Text>
        <Text className="text-xs text-ink-secondary">{job.address}</Text>
      </View>

      <Text className="text-xs text-ink" numberOfLines={2}>
        {job.description}
      </Text>

      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          className="flex-1 overflow-hidden rounded"
          onPress={() => router.push(artisanJobRoute(job.id))}
        >
          <LinearGradient
            colors={[...colors.primaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 4 }}
          >
            <View className="items-center py-1.5">
              <Text className="font-medium text-xs text-white">View details</Text>
            </View>
          </LinearGradient>
        </Pressable>
        <Button
          size="icon"
          variant="ghost"
          icon={icons.xMark}
          accessibilityLabel="Decline job"
          loading={isRejecting}
          onPress={onReject}
          className="h-6 w-6 rounded bg-surface"
          iconSize={12}
        />
      </View>
    </View>
  );
}

type ArtisanJobRowProps = {
  job: ArtisanJob;
  onPress?: () => void;
};

export function ArtisanJobRow({ job, onPress }: ArtisanJobRowProps) {
  const categoryName = job.category?.name ?? "Service";
  const categorySlug = job.category?.slug ?? "general-repairs";
  const statusLabel = getArtisanJobStatusLabel(job.status);
  const tone = getStatusTone(job.status);

  const content = (
    <View className="flex-row items-center justify-between rounded-2xl border border-line bg-surface-muted p-2.5 shadow-sm">
      <View className="flex-row items-center gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-muted">
          <CategoryIcon slug={categorySlug} size={14} />
        </View>
        <View>
          <Text className="font-medium text-sm text-ink">{categoryName}</Text>
          <Text className="text-[10px] text-ink-secondary">
            {formatRequestDate(job.preferred_time ?? job.created_at)}
          </Text>
        </View>
      </View>
      <View className={cn("rounded-full px-2.5 py-1", tone.bg)}>
        <Text className={cn("font-semibold text-xs", tone.text)}>{statusLabel}</Text>
      </View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

function getStatusTone(status: ArtisanJob["status"]): { bg: string; text: string } {
  if (status === "completed") {
    return { bg: "bg-success-subtle", text: "text-success" };
  }
  if (status === "cancelled") {
    return { bg: "bg-danger-subtle", text: "text-danger" };
  }
  if (["accepted", "on_the_way", "arrived", "in_progress", "confirmed"].includes(status)) {
    return { bg: "bg-warning-subtle", text: "text-warning" };
  }
  return { bg: "bg-primary-subtle", text: "text-primary" };
}
