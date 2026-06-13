import { View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button, Text } from "@/components/ui";
import { routes } from "@/lib/routes";
import { images } from "@/constants/images";

/** Splash screen (Figma 8:836). */
export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-splash px-6">
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center">
        <Image source={images.logo} style={{ width: 120, height: 120 }} contentFit="contain" />
        <Text className="mt-6 font-medium text-base text-white">Welcome To Arteesans.ng</Text>
      </View>

      <View className="gap-5 pb-4">
        <Text className="text-center text-sm leading-5 text-[#aab3c0]">
          One place with the best artisans. Request for any professional and get in touch with them
          to get the job done.
        </Text>
        <Button title="Get Started" onPress={() => router.push(routes.auth.login)} />
      </View>
    </SafeAreaView>
  );
}
