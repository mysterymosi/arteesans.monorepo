import { Drawer } from "expo-router/drawer";
import { ArtisanDrawerContent, type ArtisanDrawerContentProps } from "@/features/artisan";

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
        drawerItemStyle: { display: "none" },
      }}
    >
      <Drawer.Screen name="(stack)" options={{ swipeEnabled: false }} />
    </Drawer>
  );
}
