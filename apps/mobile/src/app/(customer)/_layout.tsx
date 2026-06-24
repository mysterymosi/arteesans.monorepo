import { Drawer } from "expo-router/drawer";
import { CustomerDrawerContent, type CustomerDrawerContentProps } from "@/features/customer";

export default function CustomerLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomerDrawerContent {...(props as CustomerDrawerContentProps)} />
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
