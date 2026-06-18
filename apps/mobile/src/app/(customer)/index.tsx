import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Text } from "@/components/ui";
import { MenuButton } from "@/components/navigation";
import {
  CustomerSearchBar,
  formatAddressLocationLabel,
  useCustomerDefaultAddress,
} from "@/features/customer";
import {
  CategoryChip,
  isActiveRequestStatus,
  RequestCard,
  useCustomerRequests,
  useServiceCategories,
} from "@/features/service-requests";
import { newRequestRoute, routes } from "@/lib/routes";
import { useAuthProfile } from "@/providers/auth-provider";
import { colors } from "@/theme";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";

/** Customer home (Figma 8:893). */
export default function CustomerHome() {
  const { profile } = useAuthProfile();
  const { data: categories = [], isLoading: categoriesLoading } = useServiceCategories();
  const { data: requests = [], isLoading: requestsLoading } = useCustomerRequests();
  const { data: defaultAddress, isLoading: addressLoading } = useCustomerDefaultAddress();
  const [search, setSearch] = useState("");

  const firstName = profile?.first_name ?? "there";
  const locationLabel = addressLoading
    ? "..."
    : formatAddressLocationLabel(defaultAddress) ?? "Add your address";
  const activeRequests = useMemo(
    () => requests.filter((request) => isActiveRequestStatus(request.status)),
    [requests],
  );
  const recentRequests = useMemo(() => requests.slice(0, 5), [requests]);
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(query));
  }, [categories, search]);

  const isLoading = categoriesLoading || requestsLoading;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-2">
          <View className="flex-row items-center justify-between">
            <MenuButton />
            <View className="flex-row items-center gap-3">
              <Pressable accessibilityRole="button">
                <Image
                  source={icons.notificationNewDot}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
              </Pressable>
              <Avatar
                uri={profile?.profile_photo_url}
                name={[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "User"}
                size={36}
              />
            </View>
          </View>

          <View className="mt-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="font-medium text-2xl text-ink">Hello {firstName},</Text>
              <View className="mt-1 min-w-0 flex-row items-center gap-1.5">
                <Image source={icons.location} style={{ width: 16, height: 16 }} contentFit="contain" />
                <Text
                  className="min-w-0 flex-1 text-sm text-ink-secondary"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {locationLabel}
                </Text>
              </View>
            </View>
            <Button
              size="sm"
              flat
              title="+ Request Service"
              onPress={() => router.push(newRequestRoute())}
            />
          </View>

          <View className="mt-5">
            <CustomerSearchBar value={search} onChangeText={setSearch} />
          </View>
        </View>

        {isLoading ? (
          <View className="mt-16 items-center">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <>
            <View className="mt-8 px-5">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-medium text-lg text-ink">Service Categories</Text>
                <Pressable onPress={() => router.push(newRequestRoute())}>
                  <Text className="font-medium text-sm text-primary underline">See All</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4">
                {filteredCategories.map((category) => (
                  <CategoryChip
                    key={category.id}
                    name={category.name}
                    slug={category.slug}
                    onPress={() => router.push(newRequestRoute({ categorySlug: category.slug }))}
                  />
                ))}
              </ScrollView>
            </View>

            {activeRequests.length > 0 ? (
              <View className="mt-8">
                <View className="mb-4 flex-row items-center justify-between px-5">
                  <Text className="font-semibold text-lg text-ink">Active Requests</Text>
                  <Pressable onPress={() => router.push(routes.customer.bookings)}>
                    <Text className="font-medium text-sm text-primary">See All</Text>
                  </Pressable>
                </View>
                <FlatList
                  horizontal
                  data={activeRequests}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-4 px-5"
                  renderItem={({ item, index }) => (
                    <View style={{ width: 300 }}>
                      <RequestCard
                        request={item}
                        variant={index === 0 ? "featured" : "booking"}
                        onPress={() => router.push(routes.customer.bookings)}
                      />
                    </View>
                  )}
                />
              </View>
            ) : null}

            <View className="mt-8 px-5">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-medium text-lg text-ink">Recent Requests</Text>
                <Pressable onPress={() => router.push(routes.customer.bookings)}>
                  <Text className="font-medium text-sm text-primary underline">See All</Text>
                </Pressable>
              </View>
              {recentRequests.length > 0 ? (
                <View className="gap-3">
                  {recentRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      variant="compact"
                      onPress={() => router.push(routes.customer.bookings)}
                    />
                  ))}
                </View>
              ) : (
                <View className="rounded-2xl border border-line bg-surface px-4 py-8">
                  <Text className="text-center text-sm text-ink-secondary">
                    No requests yet. Tap &quot;+ Request Service&quot; to get started.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
