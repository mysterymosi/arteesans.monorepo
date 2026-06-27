import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BackButton } from "@/features/customer";
import {
  filterRequestsByTab,
  RequestCard,
  useCustomerRequests,
} from "@/features/service-requests";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { customerBookingRoute } from "@/lib/routes";
import { colors } from "@/theme";

type BookingsTab = "all" | "active" | "completed";

const TABS: { key: BookingsTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

/** Bookings list (Figma 8:2227). */
export default function BookingsScreen() {
  const [tab, setTab] = useState<BookingsTab>("all");
  const { data: requests = [], isLoading } = useCustomerRequests();

  const filteredRequests = useMemo(
    () => filterRequestsByTab(requests, tab),
    [requests, tab],
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-5 pt-2">
        <View className="flex-row items-center">
          <BackButton />
          <Text className="font-medium text-xl text-ink">My Bookings</Text>
        </View>

        <View className="mt-5 flex-row border-b border-line">
          {TABS.map((item) => {
            const selected = tab === item.key;
            return (
              <Pressable key={item.key} onPress={() => setTab(item.key)} className="mr-6">
                <Text
                  className={cn(
                    "pb-3 font-medium text-base",
                    selected ? "text-primary" : "text-ink-secondary",
                  )}
                >
                  {item.label}
                </Text>
                {selected ? <View className="h-0.5 rounded-full bg-primary" /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerClassName="gap-4 px-5 py-5" showsVerticalScrollIndicator={false}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                variant="booking"
                onPress={() => router.push(customerBookingRoute(request.id))}
              />
            ))
          ) : (
            <View className="mt-12 rounded-2xl border border-line bg-surface px-4 py-10">
              <Text className="text-center text-sm text-ink-secondary">
                No bookings in this tab yet.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
