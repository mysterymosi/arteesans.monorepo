import { useAuthActions } from "@/providers/auth-provider";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui";

/** Placeholder — implemented from Figma (Home screen 8:893) in Phase 1. */
export default function CustomerHome() {
  const { signOut } = useAuthActions();
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Text className="font-medium text-ink">Customer Home — Phase 1</Text>
      <Pressable onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
