import { TextInput, View } from "react-native";
import { Image } from "expo-image";
import { Button } from "@/components/ui";
import { icons } from "@/constants/icons";
import { colors } from "@/theme";

type CustomerSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
};

export function CustomerSearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = "Search for plumbers, electricians, cleaners...",
}: CustomerSearchBarProps) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-[29px] flex-1 flex-row items-center gap-2 rounded-xl border border-line bg-bg px-3">
        <Image
          source={icons.searchOutlined}
          style={{ width: 12, height: 12, tintColor: colors.textSecondary }}
          contentFit="contain"
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          className="flex-1 font-sans text-xs text-ink"
          style={{ height: 29, paddingVertical: 0 }}
        />
      </View>
      <Button
        size="icon"
        variant="primary"
        flat
        icon={icons.filter}
        accessibilityLabel="Filter"
        onPress={onFilterPress}
      />
    </View>
  );
}
