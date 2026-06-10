import { View, Text, TextInput, type TextInputProps } from "react-native";
import { colors } from "@/theme";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="font-medium text-sm text-ink">{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        className={`rounded-xl border bg-surface px-4 py-3.5 font-sans text-base text-ink ${error ? "border-danger" : "border-line-strong focus:border-primary"}`}
        {...rest}
      />
      {error ? <Text className="font-sans text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
