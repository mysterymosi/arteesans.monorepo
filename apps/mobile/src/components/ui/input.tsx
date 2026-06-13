import { View, TextInput, type TextInputProps } from "react-native";
import { Text } from "./text";
import { colors, typography } from "@/theme";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export type { InputProps };

export function Input({ label, error, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text style={typography.body} className="text-ink">{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        placeholderClassName="uppercase capitalize"
        className={`rounded-xl border bg-surface px-4 py-3.5 font-sans text-base text-ink ${error ? "border-danger" : "border-line focus:border-primary"}`}
        {...rest}
      />
      {error ? <Text className="text-xs text-danger font-medium">{error}</Text> : null}
    </View>
  );
}
