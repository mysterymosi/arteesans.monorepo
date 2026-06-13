import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "./text";

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, showBack = true, right }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="w-10">
        {showBack && router.canGoBack() ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-muted"
          >
            <Text className="text-lg text-ink">{"\u2190"}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="font-semibold text-xl text-ink">{title}</Text>
      <View className="w-10 items-end">{right}</View>
    </View>
  );
}
