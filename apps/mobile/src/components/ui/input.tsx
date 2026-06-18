import { View, TextInput, type TextInputProps } from "react-native";
import { Text } from "./text";
import { typography } from "@/theme";
import { cn } from "@/lib/cn";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export type { InputProps };

const PLACEHOLDER_COLOR = "#949ba9";

export function Input({ label, error, className, style, multiline, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text style={typography.body} className="text-ink">
          {label}
        </Text>
      ) : null}
      <TextInput
        multiline={multiline}
        placeholderTextColor={PLACEHOLDER_COLOR}
        className={cn(
          "rounded-xl border bg-surface px-4 font-sans text-base leading-5 text-ink",
          multiline ? "min-h-[60px] py-3" : "h-10",
          error ? "border-danger" : "border-line-input focus:border-primary",
          className,
        )}
        style={[
          { includeFontPadding: false },
          multiline ? { textAlignVertical: "top" } : { textAlignVertical: "center", paddingVertical: 0 },
          style,
        ]}
        {...rest}
      />
      {error ? <Text className="text-xs font-medium text-danger">{error}</Text> : null}
    </View>
  );
}
