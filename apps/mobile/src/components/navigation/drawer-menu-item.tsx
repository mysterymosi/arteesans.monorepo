import { Pressable } from "react-native";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { DrawerMenuItem } from "./types";

type DrawerMenuItemRowProps = {
  item: DrawerMenuItem;
  active: boolean;
  onPress: () => void;
};

export function DrawerMenuItemRow({ item, active, onPress }: DrawerMenuItemRowProps) {
  const isDanger = item.tone === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className="flex-row items-center gap-3"
    >
      {item.renderIcon(active)}
      <Text
        className={cn(
          "font-medium text-base",
          isDanger ? "text-danger" : active ? "text-primary" : "text-ink",
        )}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}
