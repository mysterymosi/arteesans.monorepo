import { View, Text } from "react-native";
import { Link } from "expo-router";

/** Placeholder — implemented from Figma (Splash 8:836 / Onboarding) in Phase 1. */
export default function Welcome() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <Text className="font-semibold text-2xl text-primary">Arteesans</Text>
      <Text className="mt-2 text-center font-sans text-ink-secondary">
        Reliable artisans. Fast matching. Transparent pricing.
      </Text>
      <Link href="/(auth)/login" className="mt-8 font-medium text-primary">
        Get started
      </Link>
    </View>
  );
}
