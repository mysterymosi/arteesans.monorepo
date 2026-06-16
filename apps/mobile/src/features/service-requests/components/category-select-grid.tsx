import { Pressable, View } from "react-native";
import type { ServiceCategory } from "@/features/service-requests/types/service-request";
import { Text } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";
import { cn } from "@/lib/cn";

type CategorySelectGridProps = {
  categories: ServiceCategory[];
  value: string | null;
  onChange: (slug: string, categoryId: string) => void;
};

export function CategorySelectGrid({ categories, value, onChange }: CategorySelectGridProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {categories.map((category) => {
        const selected = value === category.slug;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(category.slug, category.id)}
            className={cn(
              "w-[47%] flex-row items-center gap-3 rounded-2xl border px-4 py-3.5",
              selected ? "border-primary bg-primary-muted" : "border-line-strong bg-surface",
            )}
          >
            <CategoryIcon slug={category.slug} variant="request" size={20} />
            <Text className={cn("font-medium text-sm", selected ? "text-primary" : "text-ink")}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
