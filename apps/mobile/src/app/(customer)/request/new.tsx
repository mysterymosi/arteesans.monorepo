import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Text } from "@/components/ui";
import { BackButton, useCustomerDefaultAddress, formatDefaultAddressText } from "@/features/customer";
import {
  AddressPlacesAutocomplete,
  CategorySelectGrid,
  createRequestFormSchema,
  parseBudget,
  parsePreferredTime,
  RequestPhotoPicker,
  UrgencySelector,
  useCreateServiceRequestMutation,
  useServiceCategories,
  type CreateRequestFormValues,
} from "@/features/service-requests";
import { requestConfirmedRoute } from "@/lib/routes";
import { colors } from "@/theme";
import { icons } from "@/constants/icons";
import { Image } from "expo-image";

/** Request form (Figma 8:2123). */
export default function NewRequestScreen() {
  const { categorySlug: initialSlug } = useLocalSearchParams<{ categorySlug?: string }>();
  const { data: categories = [], isLoading } = useServiceCategories();
  const { data: defaultAddress } = useCustomerDefaultAddress();
  const createRequest = useCreateServiceRequestMutation();
  const hasPrefilledAddress = useRef(false);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestFormSchema),
    defaultValues: {
      categoryId: "",
      categorySlug: initialSlug ?? "",
      description: "",
      urgency: "emergency",
      preferredTime: "",
      budget: "",
      address: "",
      latitude: 0,
      longitude: 0,
      photoUris: [],
    },
  });

  useEffect(() => {
    if (!initialSlug || categories.length === 0) return;
    const match = categories.find((category) => category.slug === initialSlug);
    if (match) {
      setValue("categoryId", match.id);
      setValue("categorySlug", match.slug);
    }
  }, [categories, initialSlug, setValue]);

  useEffect(() => {
    if (!defaultAddress || hasPrefilledAddress.current) return;

    const addressText = formatDefaultAddressText(defaultAddress);
    if (addressText) {
      setValue("address", addressText);
    }

    if (defaultAddress.latitude != null && defaultAddress.longitude != null) {
      setValue("latitude", defaultAddress.latitude, { shouldValidate: true });
      setValue("longitude", defaultAddress.longitude, { shouldValidate: true });
    }

    hasPrefilledAddress.current = true;
  }, [defaultAddress, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const requestId = await createRequest.mutateAsync({
        categoryId: data.categoryId,
        description: data.description,
        urgency: data.urgency,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        preferredTime: parsePreferredTime(data.preferredTime),
        budget: parseBudget(data.budget),
        photoUris: data.photoUris,
      });

      router.replace(requestConfirmedRoute(requestId));
    } catch (error) {
      console.error(error);
      setError("root", {
        message: error instanceof Error ? error.message : "Could not submit request.",
      });
    }
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
          <View className="flex-row items-center">
            <BackButton />
            <Text className="font-medium text-xl text-ink">Request A Service</Text>
          </View>

          {isLoading ? (
            <View className="mt-16 items-center">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View className="mt-8 gap-6">
              <View className="gap-3">
                <Text className="font-medium text-base text-ink">Select Category</Text>
                <Controller
                  control={control}
                  name="categorySlug"
                  render={({ field: { value, onChange } }) => (
                    <CategorySelectGrid
                      categories={categories}
                      value={value || null}
                      onChange={(slug, categoryId) => {
                        onChange(slug);
                        setValue("categoryId", categoryId, { shouldValidate: true });
                      }}
                    />
                  )}
                />
                {errors.categoryId ? (
                  <Text className="text-xs text-danger">{errors.categoryId.message}</Text>
                ) : null}
              </View>

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1.5">
                    <Text className="font-medium text-sm text-ink">Describe what you need</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="e.g My Kitchen sink is leaking..."
                      placeholderTextColor={colors.textMuted}
                      multiline
                      textAlignVertical="top"
                      className="min-h-[120px] rounded-2xl border border-line-strong bg-surface px-4 py-3.5 font-sans text-base text-ink"
                    />
                    {errors.description ? (
                      <Text className="text-xs text-danger">{errors.description.message}</Text>
                    ) : null}
                  </View>
                )}
              />

              <View className="gap-3">
                <Text className="font-medium text-sm text-ink">How Urgent is this</Text>
                <Controller
                  control={control}
                  name="urgency"
                  render={({ field: { value, onChange } }) => (
                    <UrgencySelector value={value} onChange={onChange} />
                  )}
                />
              </View>

              <Controller
                control={control}
                name="preferredTime"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1.5">
                    <Text className="font-medium text-sm text-ink">Preferred Time</Text>
                    <View className="flex-row items-center rounded-2xl border border-line-strong bg-surface px-4 py-3.5">
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="mm/dd/yy"
                        placeholderTextColor={colors.textMuted}
                        className="flex-1 font-sans text-base text-ink"
                      />
                      <Image source={icons.date} style={{ width: 24, height: 24 }} contentFit="contain" />
                    </View>
                  </View>
                )}
              />

              <Controller
                control={control}
                name="budget"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1.5">
                    <Text className="font-medium text-sm text-ink">Estimated Budget (₦)</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="₦3,000"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      className="rounded-2xl border border-line-strong bg-surface px-4 py-3.5 font-sans text-base text-ink"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AddressPlacesAutocomplete
                    address={value}
                    onAddressChange={onChange}
                    onAddressBlur={onBlur}
                    onCoordinatesChange={(coords) => {
                      setValue("latitude", coords.latitude, { shouldValidate: true });
                      setValue("longitude", coords.longitude, { shouldValidate: true });
                    }}
                    error={errors.address?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="photoUris"
                render={({ field: { value, onChange } }) => (
                  <RequestPhotoPicker
                    photoUris={value}
                    onChange={(uris) => {
                      onChange(uris);
                      clearErrors("photoUris");
                    }}
                    onError={(message) => setError("photoUris", { message })}
                    error={errors.photoUris?.message}
                  />
                )}
              />

              {errors.root?.message ? (
                <Text className="text-center text-sm text-danger">{errors.root.message}</Text>
              ) : null}

              <Button title="Submit Request" loading={createRequest.isPending} onPress={onSubmit} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
