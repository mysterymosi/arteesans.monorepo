import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { router } from "expo-router";
import { loginSchema, type LoginInput } from "@arteesans/shared";
import { Button, FormInput, Text } from "@/components/ui";
import { useSignInMutation, getPostAuthRoute } from "@/features/auth";
import { routes, verifyOtpRoute } from "@/lib/routes";
import { useAuthProfile } from "@/providers/auth-provider";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";

/** Log in screen (Figma 8:2082) — email + password. */
export default function Login() {
  const { refreshProfile } = useAuthProfile();
  const signInMutation = useSignInMutation();

  const { control, handleSubmit, setError, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "delivered@resend.dev", password: "Boot-Strap0107" },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await signInMutation.mutateAsync(data);

    if (result.needsVerification) {
      router.push(verifyOtpRoute({ email: data.email }));
      return;
    }

    if (result.error) {
      setError("root", { message: result.error });
      return;
    }

    const profile = await refreshProfile();
    router.replace(getPostAuthRoute(profile));
  });

  return (
    <View className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex-grow px-6 pb-10 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace(routes.auth.welcome))}
            className="h-10 w-10 justify-center"
          >
            <Image source={icons.arrowLeft} style={{ width: 24, height: 24 }} contentFit="contain" />
          </Pressable>

          <Text className="mt-2 font-semibold text-xl text-ink">Log in</Text>
          <Text className="mt-1 text-sm text-ink-secondary">
            Welcome back. Enter your details to continue.
          </Text>

          <View className="mt-8 gap-5">
            <FormInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="email address"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <FormInput
              control={control}
              name="password"
              label="Password"
              placeholder="password"
              secureTextEntry
              autoComplete="current-password"
            />
          </View>

          {errors.root?.message ? (
            <View className="mt-5 flex-row items-center gap-3 rounded-2xl bg-danger-muted px-4 py-3.5">
              <Text className="flex-1 font-medium text-sm leading-5 text-danger text-center">
                {errors.root.message}
              </Text>
            </View>
          ) : null}

          <View className="mt-6">
            <Button title="Log in" loading={signInMutation.isPending} onPress={onSubmit} />
          </View>

          <Text className="mt-5 text-center font-sans text-sm text-ink-secondary">
            Don&apos;t have an account?{" "}
            <Text
              className="font-medium text-primary"
              onPress={() => router.replace(routes.auth.signUp)}
            >
              Sign up
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
