import { View } from "react-native";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";

/** Face scan intro graphic — Figma 36:2455 */
export function FaceScanIllustration() {
  return (
    <View className="size-[200px] rounded-full border border-line p-[5px]">
      <View className="h-full w-full items-center justify-center rounded-full bg-primary-muted">
        <Image source={icons.faceRecognition} style={{ width: 68, height: 68 }} contentFit="contain" />
      </View>
    </View>
  );
}
