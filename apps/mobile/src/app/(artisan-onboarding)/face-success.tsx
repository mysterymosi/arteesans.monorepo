import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Button, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { useOnboardingDraft } from "@/features/artisan-onboarding";
import { useAuthProfile } from "@/providers/auth-provider";
import { routes } from "@/lib/routes";
import { colors } from "@/theme";

/** Face scan success — Figma 325:4819 */
export default function ArtisanOnboardingFaceSuccess() {
  const { draft } = useOnboardingDraft();
  const { profile } = useAuthProfile();
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Verified";

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1 px-5 pb-10 pt-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-10 w-10 justify-center"
        >
          <Image source={icons.arrowLeft} style={{ width: 24, height: 24 }} contentFit="contain" />
        </Pressable>

        <View className="-mt-8 flex-1 items-center justify-center gap-10">
          <View className="items-center">
            <View
              className="h-[260px] w-[260px] overflow-hidden rounded-full border-[6px]"
              style={{ borderColor: colors.primary }}
            >
              {draft.facePhotoUri ? (
                <Image
                  source={{ uri: draft.facePhotoUri }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : null}
            </View>
            <View className="-mt-8 flex-row items-center gap-3 rounded-full bg-surface-muted px-5 py-2.5">
              <View
                className="h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-xs text-white">✓</Text>
              </View>
              <Text className="text-base text-primary">{displayName}</Text>
            </View>
          </View>

          <Button className="w-full" title="Next" onPress={() => router.push(routes.artisanOnboarding.guarantor)} />
        </View>
      </View>
    </View>
  );
}
