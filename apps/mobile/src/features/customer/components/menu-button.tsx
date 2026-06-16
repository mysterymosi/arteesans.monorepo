import { Pressable } from "react-native";
import { Image } from "expo-image";
import { DrawerActions, useNavigation } from "expo-router/react-navigation";
import { icons } from "@/constants/icons";

export function MenuButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      className="h-10 w-10 items-center justify-center"
    >
      <Image source={icons.menu} style={{ width: 16, height: 16 }} contentFit="contain" />
    </Pressable>
  );
}
