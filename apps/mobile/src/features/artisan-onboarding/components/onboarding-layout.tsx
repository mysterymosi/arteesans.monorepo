import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { router, type Href } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui";
import { icons } from "@/constants/icons";

type OnboardingLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: Href;
  scroll?: boolean;
  headerLight?: boolean;
};

export function OnboardingLayout({
  title,
  subtitle,
  children,
  footer,
  backHref,
  scroll = true,
  headerLight = false,
}: OnboardingLayoutProps) {
  const content = (
    <View className="gap-6 px-5 pb-10 pt-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
            return;
          }
          if (backHref) {
            router.replace(backHref);
          }
        }}
        className="h-10 w-10 justify-center"
      >
        <Image
          source={icons.arrowLeft}
          style={{ width: 24, height: 24, tintColor: headerLight ? "#ffffff" : undefined }}
          contentFit="contain"
        />
      </Pressable>

      <View className="gap-1">
        <Text className={headerLight ? "font-medium text-2xl text-white" : "font-medium text-2xl text-ink"}>
          {title}
        </Text>
        <Text className={headerLight ? "text-base text-white/80" : "text-base text-ink-secondary"}>
          {subtitle}
        </Text>
      </View>

      {children}
      {footer}
    </View>
  );

  return (
    <View className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {scroll ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled">
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
