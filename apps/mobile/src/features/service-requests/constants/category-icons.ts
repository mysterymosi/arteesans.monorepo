import type { ServiceCategorySlug } from "@arteesans/shared";
import { icons } from "@/constants/icons";
import { colors } from "@/theme";

export const CATEGORY_ICON_SOURCES: Record<ServiceCategorySlug | string, number> = {
  plumbing: icons.categories.water,
  electrical: icons.categories.electricBolt,
  carpentry: icons.categories.hammer,
  cleaning: icons.categories.clean,
  driving: icons.categories.steering,
  "general-repairs": icons.categories.repair,
  "hair-styling": icons.categories.scissor,
};

/** Accent colors for category icons on the new request form. */
export const CATEGORY_REQUEST_COLORS: Partial<Record<ServiceCategorySlug | string, string>> = {
  plumbing: colors.primary,
  electrical: colors.warning,
  cleaning: colors.success,
  "general-repairs": colors.text,
  carpentry: "#CA8000",
  "hair-styling": "#3C24F7",
  painting: colors.primaryLight,
  driving: "#FF0000",
};

export function getCategoryIconSource(slug: string): number {
  return CATEGORY_ICON_SOURCES[slug] ?? icons.categories.repair;
}

export function getCategoryIconColor(slug: string, variant: "home" | "request" = "home"): string {
  if (variant === "home") return colors.text;
  return CATEGORY_REQUEST_COLORS[slug] ?? colors.text;
}
