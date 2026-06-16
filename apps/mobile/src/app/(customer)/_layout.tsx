import { Drawer } from "expo-router/drawer";
import { CustomerDrawerContent, type CustomerDrawerContentProps } from "@/features/customer";

const hiddenDrawerItem = { drawerItemStyle: { display: "none" as const }, title: "" };

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
      }}
    >
      <Drawer.Screen name="index" options={hiddenDrawerItem} />
      <Drawer.Screen name="bookings" options={{ ...hiddenDrawerItem, swipeEnabled: false }} />
      <Drawer.Screen name="profile" options={hiddenDrawerItem} />
      <Drawer.Screen name="request/new" options={{ ...hiddenDrawerItem, swipeEnabled: false }} />
      <Drawer.Screen
        name="request/confirmed"
        options={{ ...hiddenDrawerItem, swipeEnabled: false }}
      />
    </Drawer>
  );
}
