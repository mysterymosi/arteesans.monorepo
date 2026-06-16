import { Pressable, View } from "react-native";
import { Text } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";

type CategoryChipProps = {
  name: string;
  slug: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ name, slug, selected, onPress }: CategoryChipProps) {
  void selected;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="items-center gap-2 opacity-100"
    >
      <View
        className="h-14 w-14 items-center justify-center rounded-full bg-line"
      >
        <CategoryIcon slug={slug} variant="home" size={20} />
      </View>
      <Text className="max-w-[72px] text-center text-xs text-ink-secondary" numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}
