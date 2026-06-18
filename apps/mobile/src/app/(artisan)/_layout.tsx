import { Drawer } from "expo-router/drawer";
import { ArtisanDrawerContent, type ArtisanDrawerContentProps } from "@/features/artisan";

const hiddenDrawerItem = { drawerItemStyle: { display: "none" as const }, title: "" };

export default function ArtisanLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <ArtisanDrawerContent {...(props as ArtisanDrawerContentProps)} />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { width: "78%" },
        overlayColor: "rgba(0,0,0,0.35)",
        swipeEdgeWidth: 48,
      }}
    >
      <Drawer.Screen name="index" options={hiddenDrawerItem} />
      <Drawer.Screen name="jobs" options={hiddenDrawerItem} />
      <Drawer.Screen name="chat" options={hiddenDrawerItem} />
      <Drawer.Screen name="earnings" options={hiddenDrawerItem} />
      <Drawer.Screen name="profile" options={hiddenDrawerItem} />
    </Drawer>
  );
}
