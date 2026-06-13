import { View } from "react-native";
import { Text } from "./text";

type Tone = "primary" | "success" | "warning" | "danger" | "neutral";

const tones: Record<Tone, { bg: string; text: string }> = {
  primary: { bg: "bg-primary-muted", text: "text-primary" },
  success: { bg: "bg-success-muted", text: "text-success" },
  warning: { bg: "bg-warning-muted", text: "text-warning" },
  danger: { bg: "bg-danger-muted", text: "text-danger" },
  neutral: { bg: "bg-surface-muted", text: "text-ink-secondary" },
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <View className={`self-start rounded-full px-3 py-1 ${t.bg}`}>
      <Text className={`font-medium text-xs ${t.text}`}>{label}</Text>
    </View>
  );
}
