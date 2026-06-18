import type { Href } from "expo-router";
import type { ReactNode } from "react";

export type DrawerContentProps = {
  navigation: { closeDrawer: () => void };
} & Record<string, unknown>;

export type DrawerMenuItem = {
  key: string;
  label: string;
  href?: Href;
  onPress?: () => void | Promise<void>;
  isActive: (pathname: string) => boolean;
  renderIcon: (active: boolean) => ReactNode;
  tone?: "default" | "danger";
};
