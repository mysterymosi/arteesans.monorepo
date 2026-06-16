import { Pressable, View } from "react-native";
import { Text, StatusChip, Avatar } from "@/components/ui";
import { CategoryIcon } from "@/features/service-requests/components/category-icon";
import { formatNaira, formatPersonName, formatRequestDate } from "@/lib/format";
import type { CustomerServiceRequest } from "@/features/service-requests/types/service-request";
import { cn } from "@/lib/cn";

type RequestCardProps = {
  request: CustomerServiceRequest;
  variant?: "featured" | "compact" | "booking";
  onPress?: () => void;
};

function extractLocationLabel(address: string): string {
  const parts = address.split(",").map((part) => part.trim());
  if (parts.length >= 2) {
    return parts.slice(-2).join(", ");
  }
  return address;
}

export function RequestCard({ request, variant = "booking", onPress }: RequestCardProps) {
  const categoryName = request.category?.name ?? "Service";
  const categorySlug = request.category?.slug ?? "general-repairs";
  const artisanName = request.artisan
    ? formatPersonName(request.artisan.first_name, request.artisan.last_name)
    : null;
  const isFeatured = variant === "featured";
  const showArtisan = Boolean(artisanName);
  const showTrack = isActiveStatus(request.status);

  const content = (
    <View
      className={cn(
        "rounded-2xl p-4",
        isFeatured ? "bg-primary" : "border border-line bg-surface-muted",
        variant === "compact" && "border border-line bg-surface-muted p-3.5",
      )}
      style={isFeatured ? undefined : undefined}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-row items-center gap-3">
          <View
            className={cn(
              "h-10 w-10 items-center justify-center rounded-full",
              isFeatured ? "bg-white/15" : "bg-surface",
            )}
          >
            <CategoryIcon
              slug={categorySlug}
              variant="home"
              color={isFeatured ? "#ffffff" : undefined}
              size={20}
            />
          </View>
          <View>
            <Text className={cn("font-semibold text-base", isFeatured ? "text-white" : "text-ink")}>
              {categoryName}
            </Text>
            <Text className={cn("text-sm", isFeatured ? "text-white/80" : "text-ink-secondary")}>
              {isFeatured ? extractLocationLabel(request.address) : formatRequestDate(request.preferred_time ?? request.created_at)}
            </Text>
          </View>
        </View>
        <StatusChip status={request.status} />
      </View>

      {variant !== "compact" ? (
        <Text
          className={cn("mt-3 text-sm leading-5", isFeatured ? "text-white/90" : "text-ink-secondary")}
          numberOfLines={2}
        >
          {request.description}
        </Text>
      ) : (
        <Text className="mt-2 text-sm text-ink-secondary" numberOfLines={1}>
          {request.description}
        </Text>
      )}

      {showArtisan && variant !== "compact" ? (
        <View
          className={cn(
            "mt-3 flex-row items-center justify-between rounded-xl px-3 py-2.5",
            isFeatured ? "bg-white/10" : "bg-surface",
          )}
        >
          <View className="flex-row items-center gap-2.5">
            <Avatar
              uri={request.artisan?.profile_photo_url}
              name={artisanName ?? "Artisan"}
              size={32}
            />
            <View>
              <Text className={cn("font-medium text-sm", isFeatured ? "text-white" : "text-ink")}>
                {artisanName}
              </Text>
              <Text className={cn("text-xs", isFeatured ? "text-white/75" : "text-ink-secondary")}>
                ⭐ 4.8 (100 reviews)
              </Text>
            </View>
          </View>
          <Text className={isFeatured ? "text-white/70" : "text-ink-muted"}>›</Text>
        </View>
      ) : null}

      {variant !== "compact" ? (
        <View className="mt-3 flex-row items-center justify-between">
          <Text className={cn("font-semibold text-base", isFeatured ? "text-white" : "text-ink")}>
            {formatNaira(request.budget)}
          </Text>
          {showTrack ? (
            <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <Text className="text-sm text-warning">📍</Text>
              <Text className={cn("font-medium text-sm", isFeatured ? "text-white" : "text-primary")}>
                Track
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

function isActiveStatus(status: CustomerServiceRequest["status"]): boolean {
  return ["matched", "confirmed", "accepted", "on_the_way", "arrived", "in_progress"].includes(status);
}
