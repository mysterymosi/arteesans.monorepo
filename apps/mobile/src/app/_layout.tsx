import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuthSession } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => { });

function SplashController() {
  const { isLoading } = useAuthSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [isLoading]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <SplashController />
        <StatusBar hidden />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(artisan)" />
        </Stack>
      </AuthProvider>
    </QueryProvider>
  );
}
