import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "@/lib/cn";

type TextProps = RNTextProps & {
  className?: string;
};

/** App text — defaults to Outfit via NativeWind `font-sans`. */
export function Text({ className, ...props }: TextProps) {
  return <RNText className={cn("font-sans", className)} {...props} />;
}
