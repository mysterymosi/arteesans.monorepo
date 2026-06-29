import { Pressable, View } from "react-native";
import { Text } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";
import type { OpenRequest } from "@/features/open-requests/types/open-request";
import { formatDistance, formatNaira, formatRequestDate } from "@/lib/format";
import { getUrgencyLabel } from "@/features/artisan-jobs/types/artisan-job";

type OpenRequestRowProps = {
  request: OpenRequest;
  onPress: () => void;
};

export function OpenRequestRow({ request, onPress }: OpenRequestRowProps) {
  const hasInterest = request.interest_status === "pending";

  return (
    <Pressable
      onPress={onPress}
      className="gap-3 rounded-2xl border border-line bg-surface-muted p-4"
    >
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-muted">
          <CategoryIcon slug={request.category_slug} size={20} />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-semibold text-base text-ink">{request.category_name}</Text>
          <Text className="text-sm text-ink-secondary">{getUrgencyLabel(request.urgency)}</Text>
        </View>
        <Text className="font-semibold text-sm text-primary">{formatNaira(request.budget)}</Text>
      </View>
      <Text className="text-sm text-ink-secondary" numberOfLines={2}>
        {request.description}
      </Text>
      <View className="flex-row flex-wrap gap-x-3 gap-y-1">
        <Text className="text-xs text-ink-secondary">{request.address}</Text>
        <Text className="text-xs text-ink-secondary">
          {formatDistance(request.distance_meters)} · {formatRequestDate(request.preferred_time)}
        </Text>
      </View>
      {hasInterest ? (
        <Text className="font-medium text-sm text-primary">Interest submitted</Text>
      ) : null}
    </Pressable>
  );
}
