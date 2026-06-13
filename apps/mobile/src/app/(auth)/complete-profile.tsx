import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { type ProfileCompletion, type UserRole } from "@arteesans/shared";
import { Button, FormInput, Text } from "@/components/ui";
import { useCompleteProfileMutation } from "@/hooks/use-auth-mutations";
import { profileFormResolver } from "@/lib/form-resolvers";
import { getPostAuthRoute } from "@/lib/auth-routing";
import { routes } from "@/lib/routes";
import { useAuthProfile } from "@/providers/auth-provider";

export default function CompleteProfile() {
  const { role: roleParam } = useLocalSearchParams<{ role?: UserRole }>();
  const { refreshProfile } = useAuthProfile();
  const completeProfileMutation = useCompleteProfileMutation();

  const role = roleParam === "customer" || roleParam === "artisan" ? roleParam : null;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileCompletion>({
    resolver: profileFormResolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      role: role ?? "customer",
    },
  });

  useEffect(() => {
    if (!role) {
      router.replace(routes.auth.roleSelect);
    }
  }, [role]);

  const onSubmit = handleSubmit(async (data) => {
    if (!role) return;

    const result = await completeProfileMutation.mutateAsync({ ...data, role });
    if (result.error) {
      setError("root", { message: result.error });
      return;
    }

    const nextProfile = await refreshProfile();
    router.replace(getPostAuthRoute(nextProfile));
  });

  const heading = role === "artisan" ? "Set up your artisan profile" : "Complete your profile";

  return (
    <View className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex-grow px-6 pb-8 pt-10"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-semibold text-3xl text-ink">{heading}</Text>
          <Text className="mt-2 font-sans text-base text-ink-secondary">
            Tell us a bit about you. Phone verification is not required at sign-up.
          </Text>

          <View className="mt-8 gap-4">
            <FormInput
              control={control}
              name="firstName"
              label="First name"
              autoComplete="given-name"
            />
            <FormInput
              control={control}
              name="lastName"
              label="Last name"
              autoComplete="family-name"
            />
            <FormInput
              control={control}
              name="phone"
              label="Phone number"
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder="08012345678"
            />
          </View>

          {errors.root?.message ? (
            <Text className="mt-4 font-sans text-sm text-danger">{errors.root.message}</Text>
          ) : null}

          <View className="mt-6">
            <Button
              title="Continue"
              loading={completeProfileMutation.isPending}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
