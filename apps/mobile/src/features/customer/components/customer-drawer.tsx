import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router, usePathname, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import { HomeIcon } from "@/features/customer/components/home-icon";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/cn";
import { newRequestRoute, routes } from "@/lib/routes";
import { useAuthActions } from "@/providers/auth-provider";

export type CustomerDrawerContentProps = {
  navigation: { closeDrawer: () => void };
} & Record<string, unknown>;

type MenuItem = {
  key: string;
  label: string;
  href: Href;
  icon: "home" | "request" | "booking";
  isActive: (pathname: string) => boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    key: "home",
    label: "Home",
    href: routes.customer.home,
    icon: "home",
    isActive: (pathname) =>
      pathname === "/(customer)" ||
      pathname === "/(customer)/" ||
      pathname.endsWith("/(customer)") ||
      pathname.endsWith("/(customer)/index"),
  },
  {
    key: "request",
    label: "Request",
    href: newRequestRoute(),
    icon: "request",
    isActive: (pathname) => pathname.includes("/request/new"),
  },
  {
    key: "booking",
    label: "Booking",
    href: routes.customer.bookings,
    icon: "booking",
    isActive: (pathname) => pathname.includes("/bookings"),
  },
];

export function CustomerDrawerContent(props: CustomerDrawerContentProps) {
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const { navigation, ...rest } = props;

  function navigate(href: Href) {
    navigation.closeDrawer();
    router.push(href);
  }

  async function handleSignOut() {
    navigation.closeDrawer();
    await signOut();
    router.replace(routes.auth.welcome);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <ScrollView {...rest} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 pt-2">
          <View className="flex-row items-center justify-between border-b border-line pb-4">
            <Text className="font-medium text-sm tracking-[0.2em] text-ink">MENU</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={() => navigation.closeDrawer()}
              className="h-10 w-10 items-center justify-center"
            >
              <Image source={icons.xMark} style={{ width: 24, height: 24 }} contentFit="contain" />
            </Pressable>
          </View>

          <View className="mt-6 gap-6">
            {MENU_ITEMS.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => navigate(item.href)}
                  className="flex-row items-center gap-3"
                >
                  {item.icon === "home" ? (
                    <HomeIcon active={active} />
                  ) : (
                    <Image
                      source={item.icon === "request" ? icons.plus : icons.orderApprove}
                      style={{ width: 18, height: 18 }}
                      contentFit="contain"
                    />
                  )}
                  <Text className={cn("font-medium text-base", active ? "text-primary" : "text-ink")}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-line px-6 py-5">
        <Pressable
          accessibilityRole="button"
          onPress={handleSignOut}
          className="flex-row items-center gap-3"
        >
          <Image source={icons.logout} style={{ width: 20, height: 20 }} contentFit="contain" />
          <Text className="font-medium text-base text-danger">Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
