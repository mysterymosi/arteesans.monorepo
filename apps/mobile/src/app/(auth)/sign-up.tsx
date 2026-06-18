import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { type SignUpInput, type UserRole } from "@arteesans/shared";
import { Button, FormInput, Text } from "@/components/ui";
import { colors } from "@/theme";
import { useSignUpMutation } from "@/features/auth";
import { AddressPlacesAutocomplete } from "@/features/service-requests";
import { signUpFormResolver } from "@/lib/form-resolvers";
import { homeRouteForRole, routes, verifyOtpRoute } from "@/lib/routes";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";

type Role = Exclude<UserRole, "admin">;

const ROLE_OPTIONS: { role: Role; label: string }[] = [
  { role: "customer", label: "Book services" },
  { role: "artisan", label: "Work as an artisan" },
];

/** Sign up / Create Account screen (Figma 8:847). */
export default function SignUp() {
  const signUpMutation = useSignUpMutation();

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: signUpFormResolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      latitude: undefined,
      longitude: undefined,
      password: "",
      confirmPassword: "",
      role: "customer",
      acceptedTerms: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await signUpMutation.mutateAsync(data);

    if (result.error) {
      setError("root", { message: result.error });
      return;
    }

    if (result.verified) {
      router.replace(
        data.role === "artisan" ? routes.artisanOnboarding.address : homeRouteForRole(data.role),
      );
      return;
    }

    router.push(verifyOtpRoute({ email: data.email, role: data.role }));
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
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace(routes.auth.welcome))}
            className="h-10 w-10 justify-center"
          >
            <Image source={icons.arrowLeft} style={{ width: 24, height: 24 }} contentFit="contain" />
          </Pressable>

          <Text className="mt-2 font-semibold text-xl text-ink">Create Account</Text>

          <Controller
            control={control}
            name="role"
            render={({ field: { value, onChange } }) => (
              <View className="mt-6 flex-row gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const selected = value === option.role;
                  return (
                    <Pressable
                      key={option.role}
                      accessibilityRole="button"
                      onPress={() => onChange(option.role)}
                      className={`flex-1 items-center rounded-xl border px-3 py-3 ${selected ? "border-primary bg-primary-muted" : "border-line-strong bg-surface"}`}
                    >
                      <Text
                        className={`font-medium text-sm ${selected ? "text-primary" : "text-ink-secondary"}`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />

          <View className="mt-6 gap-5">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  control={control}
                  name="firstName"
                  label="First Name"
                  placeholder="first name"
                  autoComplete="given-name"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  control={control}
                  name="lastName"
                  label="Last Name"
                  placeholder="last name"
                  autoComplete="family-name"
                />
              </View>
            </View>

            <FormInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="email address"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="gap-1.5">
                  <Text className="font-medium text-sm text-ink">Phone Number</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-row items-center rounded-xl border border-line-strong bg-surface px-3">
                      <Text className="font-sans text-base text-ink">🇳🇬 +234</Text>
                    </View>
                    <TextInput
                      value={value ?? ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="phone number"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      className={`flex-1 rounded-xl border bg-surface px-4 py-3.5 font-sans text-base text-ink ${error ? "border-danger" : "border-line-strong focus:border-primary"}`}
                    />
                  </View>
                  {error ? <Text className="font-sans text-xs text-danger">{error.message}</Text> : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <AddressPlacesAutocomplete
                  address={value}
                  onAddressChange={(text) => {
                    onChange(text);
                    setValue("latitude", undefined, { shouldValidate: true });
                    setValue("longitude", undefined, { shouldValidate: true });
                  }}
                  onAddressBlur={onBlur}
                  onCoordinatesChange={(coords) => {
                    setValue("latitude", coords.latitude, { shouldValidate: true });
                    setValue("longitude", coords.longitude, { shouldValidate: true });
                  }}
                  error={errors.location?.message}
                />
              )}
            />

            <FormInput
              control={control}
              name="password"
              label="Password"
              placeholder="password"
              secureTextEntry
              autoComplete="new-password"
            />

            <FormInput
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="password"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <Controller
            control={control}
            name="acceptedTerms"
            render={({ field: { value, onChange } }) => (
              <>
                <View className="mt-5 flex-row items-center justify-center gap-2">
                  <Checkbox
                    style={[
                      { width: 14, height: 14 },
                    ]}
                    value={value} onValueChange={onChange} color={colors.primary} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Accept terms and conditions"
                    onPress={() => onChange(!value)}
                  >
                    <Text className="text-xs text-ink-secondary">
                      I agree to Arteesan&apos;s{" "}
                      <Text className="text-primary underline">Terms and conditions</Text>
                    </Text>
                  </Pressable>
                </View>
                {errors.acceptedTerms ? (
                  <Text className="mt-1 text-center text-xs text-danger">
                    {errors.acceptedTerms.message}
                  </Text>
                ) : null}
              </>
            )}
          />

          {errors.root?.message ? (
            <Text className="mt-4 text-center font-sans text-sm text-danger">{errors.root.message}</Text>
          ) : null}

          <View className="mt-5">
            <Button title="Sign Up" loading={signUpMutation.isPending} onPress={onSubmit} />
          </View>

          <Text className="mt-5 text-center font-sans text-sm text-ink-secondary">
            Already have account?{" "}
            <Text className="font-medium text-primary" onPress={() => router.push(routes.auth.login)}>
              Log in
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
