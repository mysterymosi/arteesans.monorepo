import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { UserRole } from "@arteesans/shared";
import { Text } from "@/components/ui";
import { completeProfileRoute } from "@/lib/routes";

type RoleOption = {
  role: Exclude<UserRole, "admin">;
  title: string;
  description: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "customer",
    title: "Book a service",
    description: "Find trusted artisans for plumbing, electrical, cleaning, and more.",
  },
  {
    role: "artisan",
    title: "Join as an artisan",
    description: "Offer your skills, get matched to jobs, and grow your business.",
  },
];

export default function RoleSelect() {
  function handleSelect(role: Exclude<UserRole, "admin">) {
    router.push(completeProfileRoute({ role }));
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-6 pt-10">
      <Text className="font-semibold text-3xl text-ink">How will you use Arteesans?</Text>
      <Text className="mt-2 font-sans text-base text-ink-secondary">
        Choose one to continue. You can contact support later if you need to change this.
      </Text>

      <View className="mt-8 gap-4">
        {ROLE_OPTIONS.map((option) => (
          <Pressable
            key={option.role}
            accessibilityRole="button"
            onPress={() => handleSelect(option.role)}
            className="rounded-2xl border border-line bg-surface p-5 active:opacity-80"
          >
            <Text className="font-semibold text-lg text-ink">{option.title}</Text>
            <Text className="mt-2 font-sans text-sm text-ink-secondary">{option.description}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
