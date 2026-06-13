import { Pressable, ActivityIndicator, View, type PressableProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme";
import { Text } from "./text";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const containerStyles: Record<Variant, string> = {
  primary: "",
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

/** Figma CTA gradient (dark navy -> primary blue, left to right). */
const PRIMARY_GRADIENT = ["#16406f", "#1e5896"] as const;

type ButtonProps = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export function Button({ title, variant = "primary", loading, disabled, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;

  const content = loading ? (
    <ActivityIndicator
      color={variant === "primary" || variant === "danger" ? "#fff" : colors.primary}
    />
  ) : (
    <Text className={`font-medium text-base ${textStyles[variant]}`}>{title}</Text>
  );

  if (variant === "primary") {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        className={`overflow-hidden rounded-2xl ${isDisabled ? "opacity-50" : "active:opacity-80"}`}
        {...rest}
      >
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View className="h-13 flex-row items-center justify-center px-6 py-4">{content}</View>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={`h-13 flex-row items-center justify-center rounded-2xl px-6 py-4 ${containerStyles[variant]} ${isDisabled ? "opacity-50" : "active:opacity-80"}`}
      {...rest}
    >
      {content}
    </Pressable>
  );
}
