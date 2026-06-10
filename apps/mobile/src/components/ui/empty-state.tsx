import { View, Text } from "react-native";

type EmptyStateProps = {
  title: string;
  message?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8 py-16">
      <Text className="text-center font-semibold text-lg text-ink">{title}</Text>
      {message ? (
        <Text className="text-center font-sans text-sm text-ink-secondary">{message}</Text>
      ) : null}
      {action ? <View className="mt-4">{action}</View> : null}
    </View>
  );
}
