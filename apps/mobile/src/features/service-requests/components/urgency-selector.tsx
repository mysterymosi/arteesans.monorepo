import { Pressable, View } from "react-native";
import type { UrgencyLevel } from "@arteesans/shared";
import { URGENCY_OPTIONS } from "@arteesans/shared";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

type UrgencySelectorProps = {
  value: UrgencyLevel;
  onChange: (value: UrgencyLevel) => void;
};

export function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  return (
    <View className="gap-3">
      {URGENCY_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-3.5",
              selected ? "border-primary bg-primary-muted" : "border-line-strong bg-surface",
            )}
          >
            <Text className={cn("font-medium text-base", selected ? "text-primary" : "text-ink")}>
              {option.label}
            </Text>
            <Text className="mt-0.5 text-sm text-ink-secondary">{option.subtitle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
