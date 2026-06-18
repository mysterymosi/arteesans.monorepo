import { Pressable } from "react-native";
import { Image } from "expo-image";
import { DrawerActions, useNavigation } from "expo-router/react-navigation";
import { icons } from "@/constants/icons";

type MenuButtonProps = {
  size?: number;
};

export function MenuButton({ size = 30 }: MenuButtonProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      className="h-10 w-10 items-center justify-center"
    >
      <Image source={icons.menu} style={{ width: size, height: size }} contentFit="contain" />
    </Pressable>
  );
}
