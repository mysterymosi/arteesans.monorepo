import { Pressable, ActivityIndicator, View, type PressableProps } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme";
import { cn } from "@/lib/cn";
import { Text } from "./text";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "icon";

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

const sizeStyles: Record<
  ButtonSize,
  { container: string; text: string; radius: string; iconBox?: { width: number; height: number } }
> = {
  default: { container: "h-13 px-6 py-4", text: "text-base", radius: "rounded-2xl" },
  sm: { container: "px-4 py-3", text: "text-sm", radius: "rounded-2xl" },
  icon: { container: "", text: "", radius: "rounded-xl", iconBox: { width: 29, height: 29 } },
};

/** Figma CTA gradient (dark navy -> primary blue, left to right). */
const PRIMARY_GRADIENT = ["#16406f", "#1e5896"] as const;

type BaseButtonProps = Omit<PressableProps, "children"> & {
  variant?: Variant;
  loading?: boolean;
  flat?: boolean;
  iconSize?: number;
};

type IconButtonProps = BaseButtonProps & {
  size: "icon";
  icon: number;
  title?: string;
  accessibilityLabel: string;
};

type TextButtonProps = BaseButtonProps & {
  size?: "default" | "sm";
  title: string;
  icon?: number;
};

export type ButtonProps = IconButtonProps | TextButtonProps;

export function Button({
  title,
  variant = "primary",
  size = "default",
  flat = false,
  loading,
  disabled,
  icon,
  iconSize = 16,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isIconOnly = size === "icon";
  const useGradient = variant === "primary" && !flat && size === "default";
  const { container, text, radius, iconBox } = sizeStyles[size];

  const label = loading ? (
    <ActivityIndicator
      color={variant === "primary" || variant === "danger" ? "#fff" : colors.primary}
      size={isIconOnly ? "small" : undefined}
    />
  ) : isIconOnly ? (
    icon ? (
      <Image source={icon} style={{ width: iconSize, height: iconSize }} contentFit="contain" />
    ) : null
  ) : (
    <View className="flex-row items-center gap-2">
      {icon ? (
        <Image source={icon} style={{ width: iconSize, height: iconSize }} contentFit="contain" />
      ) : null}
      <Text className={cn("font-medium", text, textStyles[variant])}>{title}</Text>
    </View>
  );

  const pressableClassName = cn(
    !isIconOnly && "flex-row items-center justify-center overflow-hidden",
    radius,
    !isIconOnly && container,
    !useGradient && containerStyles[variant],
    isDisabled ? "opacity-50" : "active:opacity-80",
    className,
  );

  const pressableStyle = iconBox
    ? {
      width: iconBox.width,
      height: iconBox.height,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    }
    : undefined;

  if (useGradient) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        className={cn(
          radius,
          "overflow-hidden",
          isDisabled ? "opacity-50" : "active:opacity-80",
          className,
        )}
        {...rest}
      >
        <LinearGradient colors={PRIMARY_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <View className={cn("flex-row items-center justify-center", container)}>{label}</View>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={pressableClassName}
      style={pressableStyle}
      {...rest}
    >
      {label}
    </Pressable>
  );
}
