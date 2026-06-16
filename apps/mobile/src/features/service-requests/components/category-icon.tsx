import { Image } from "expo-image";
import { getCategoryIconColor, getCategoryIconSource } from "@/features/service-requests/constants/category-icons";

type CategoryIconProps = {
  slug: string;
  variant?: "home" | "request";
  color?: string;
  size?: number;
};

export function CategoryIcon({ slug, variant = "home", color, size = 24 }: CategoryIconProps) {
  return (
    <Image
      source={getCategoryIconSource(slug)}
      style={{ width: size, height: size, tintColor: color ?? getCategoryIconColor(slug, variant) }}
      contentFit="contain"
    />
  );
}
