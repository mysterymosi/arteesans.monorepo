import { Pressable } from "react-native";
import { router, type Href } from "expo-router";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";
import { routes } from "@/lib/routes";

type BackButtonProps = {
  fallbackHref?: Href;
};

export function BackButton({ fallbackHref = routes.customer.home }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackHref))}
      className="h-10 w-10 justify-center"
    >
      <Image source={icons.arrowLeft} style={{ width: 24, height: 24 }} contentFit="contain" />
    </Pressable>
  );
}
