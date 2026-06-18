import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router, usePathname, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { routes } from "@/lib/routes";
import { useAuthActions } from "@/providers/auth-provider";
import { DrawerMenuItemRow } from "./drawer-menu-item";
import type { DrawerContentProps, DrawerMenuItem } from "./types";

type AppDrawerShellProps = DrawerContentProps & {
  items: DrawerMenuItem[];
  /** Customer drawer uses a pinned footer; artisan lists logout inline (Figma 36:3471). */
  signOutPlacement?: "footer" | "inline";
};

export function AppDrawerShell({
  navigation,
  items,
  signOutPlacement = "footer",
  ...rest
}: AppDrawerShellProps) {
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  function navigate(href: Href) {
    navigation.closeDrawer();
    router.push(href);
  }

  async function handleSignOut() {
    navigation.closeDrawer();
    await signOut();
    router.replace(routes.auth.welcome);
  }

  const showFooterSignOut = signOutPlacement === "footer";

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
            {items.map((item) => {
              const active = item.isActive(pathname);
              return (
                <DrawerMenuItemRow
                  key={item.key}
                  item={item}
                  active={active}
                  onPress={() => {
                    if (item.onPress) {
                      navigation.closeDrawer();
                      void item.onPress();
                      return;
                    }
                    if (item.href) navigate(item.href);
                  }}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {showFooterSignOut ? (
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
      ) : null}
    </SafeAreaView>
  );
}
