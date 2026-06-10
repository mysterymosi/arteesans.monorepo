import { Pressable, Text, ActivityIndicator, type PressableProps } from "react-native";
import { colors } from "@/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const containerStyles: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-primary-muted",
  outline: "border border-primary bg-transparent",
  ghost: "bg-transparent",
  danger: "bg-danger",
};

const textStyles: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-primary",
  outline: "text-primary",
  ghost: "text-primary",
  danger: "text-white",
};

type ButtonProps = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export function Button({ title, variant = "primary", loading, disabled, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={`h-13 flex-row items-center justify-center rounded-2xl px-6 py-4 ${containerStyles[variant]} ${isDisabled ? "opacity-50" : "active:opacity-80"}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" || variant === "danger" ? "#fff" : colors.primary} />
      ) : (
        <Text className={`font-medium text-base ${textStyles[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
