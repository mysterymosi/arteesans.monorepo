import { Pressable, View } from "react-native";
import { Text } from "@/components/ui";
import { useAuthActions } from "@/providers/auth-provider";

/** Placeholder — implemented from Figma (Home screen online 36:2476) in Phase 2. */
export default function ArtisanDashboard() {
  const { signOut } = useAuthActions();
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Text className="font-medium text-ink">Artisan Dashboard — Phase 2</Text>
      <Pressable onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
