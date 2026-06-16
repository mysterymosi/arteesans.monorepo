import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { z } from "zod";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { otpSchema } from "@arteesans/shared";
import { Button, OTPInput, Text } from "@/components/ui";
import { getPostAuthRoute, useResendOtpMutation, useVerifyOtpMutation } from "@/features/auth";
import { routes } from "@/lib/routes";
import { useAuthProfile } from "@/providers/auth-provider";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";

const RESEND_COOLDOWN_SECONDS = 60;

const verifyOtpFormSchema = z.object({ code: otpSchema });
type VerifyOtpForm = z.infer<typeof verifyOtpFormSchema>;

function getRemainingSeconds(endsAtMs: number): number {
  return Math.max(0, Math.ceil((endsAtMs - Date.now()) / 1000));
}

/** Verification screen (Figma 8:2099). */
export default function VerifyOtp() {
  const { email, role } = useLocalSearchParams<{ email: string; role?: string }>();
  const { refreshProfile } = useAuthProfile();
  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();
  const resendEndsAtRef = useRef(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
  const [resendSeconds, setResendSeconds] = useState(RESEND_COOLDOWN_SECONDS);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyOtpForm>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!email) {
      router.replace(routes.auth.signUp);
    }
  }, [email]);

  useEffect(() => {
    const tick = () => setResendSeconds(getRemainingSeconds(resendEndsAtRef.current));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = handleSubmit(async ({ code }) => {
    if (!email) return;

    const result = await verifyMutation.mutateAsync({ email, token: code });
    if (result.error) {
      setError("code", { message: result.error });
      return;
    }

    const profile = await refreshProfile();

    if (profile?.role === "artisan" || (!profile?.role && role === "artisan")) {
      router.replace(routes.artisan);
      return;
    }
    if (profile?.role === "customer" || (!profile?.role && role === "customer")) {
      router.replace(routes.customer.home);
      return;
    }
    router.replace(getPostAuthRoute(profile));
  });

  async function handleResend() {
    if (!email || resendSeconds > 0) return;

    const result = await resendMutation.mutateAsync(email);
    if (result.error) {
      setError("root", { message: result.error });
      return;
    }

    resendEndsAtRef.current = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    setResendSeconds(RESEND_COOLDOWN_SECONDS);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface px-6 pt-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => (router.canGoBack() ? router.back() : router.replace(routes.auth.signUp))}
        className="h-10 w-10 justify-center"
      >
        <Image source={icons.arrowLeft} style={{ width: 24, height: 24 }} contentFit="contain" />
      </Pressable>

      <Text className="mt-2 font-semibold text-xl text-ink">Verify account</Text>
      <Text className="mt-1 font-sans text-sm text-ink-secondary">
        Please enter the OTP sent to {email ?? "your email"}
      </Text>

      <View className="mt-8">
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <OTPInput value={value} onChange={onChange} />
          )}
        />
        {errors.code ? (
          <Text className="mt-3 font-sans text-sm text-danger">{errors.code.message}</Text>
        ) : null}
        {errors.root?.message ? (
          <Text className="mt-3 font-sans text-sm text-danger">{errors.root.message}</Text>
        ) : null}
      </View>

      <View className="mt-8">
        <Button title="Verify" loading={verifyMutation.isPending} onPress={onSubmit} />
      </View>

      <Text className="mt-5 text-center font-sans text-sm text-ink-secondary">
        {resendSeconds > 0 ? (
          <>
            Resend in <Text className="font-medium text-primary">{resendSeconds}s</Text>
          </>
        ) : (
          <Text className="font-medium text-primary" onPress={handleResend}>
            Resend
          </Text>
        )}
      </Text>
    </SafeAreaView>
  );
}
