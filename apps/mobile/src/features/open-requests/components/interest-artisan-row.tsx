import { Pressable, View } from "react-native";
import { Avatar, Text } from "@/components/ui";
import type { RequestInterest } from "@/features/open-requests";
import { formatDistance, formatPersonName } from "@/lib/format";

type InterestArtisanRowProps = {
  interest: RequestInterest;
  onPress: () => void;
};

export function InterestArtisanRow({ interest, onPress }: InterestArtisanRowProps) {
  const name = formatPersonName(interest.first_name, interest.last_name);
  const location = [interest.city_lga, interest.state].filter(Boolean).join(", ");

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-line bg-surface-muted p-4"
    >
      <Avatar uri={interest.profile_photo_url} name={name} size={56} />
      <View className="min-w-0 flex-1 gap-1">
        <Text className="font-semibold text-base text-ink">{name}</Text>
        <Text className="text-sm text-ink-secondary">
          {interest.average_rating.toFixed(1)} rating · {interest.completed_jobs} jobs
        </Text>
        <Text className="text-sm text-ink-secondary">
          {formatDistance(interest.distance_meters, { away: true })}
          {location ? ` · ${location}` : ""}
        </Text>
      </View>
    </Pressable>
  );
}
