import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { router } from "expo-router";
import { artisanAddressStepSchema, type ArtisanAddressStep } from "@arteesans/shared";
import { Button, Text } from "@/components/ui";
import {
  FileUploadField,
  formatArtisanAddressLabel,
  OnboardingLayout,
  useArtisanProfile,
  useOnboardingDraft,
} from "@/features/artisan-onboarding";
import { routes } from "@/lib/routes";
import { useAuthSession } from "@/providers/auth-provider";

/** Proof of address — residential address is saved at sign-up. */
export default function ArtisanOnboardingAddress() {
  const { session } = useAuthSession();
  const { draft, patchDraft } = useOnboardingDraft();
  const { data: artisanProfile } = useArtisanProfile(session?.user.id);
  const savedAddress = formatArtisanAddressLabel(artisanProfile);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ArtisanAddressStep>({
    resolver: zodResolver(artisanAddressStepSchema),
    defaultValues: {
      proofOfAddressUri: draft.proofOfAddressUri ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    patchDraft({
      proofOfAddressUri: values.proofOfAddressUri,
      proofOfAddressFileName: draft.proofOfAddressFileName,
    });
    router.push(routes.artisanOnboarding.identity);
  });

  return (
    <OnboardingLayout
      title="Address Verification"
      subtitle="Upload proof of address for your registered location"
      backHref={routes.auth.verifyOtp}
      footer={<Button title="Next" onPress={onSubmit} className="mt-2" />}
    >
      {savedAddress ? (
        <View className="gap-1 rounded-xl border border-line/40 bg-surface-muted px-4 py-3">
          <Text className="font-medium text-sm text-ink">Registered address</Text>
          <Text className="text-sm text-ink-secondary">{savedAddress}</Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="proofOfAddressUri"
        render={({ field: { value, onChange } }) => (
          <FileUploadField
            title="Proof of Address"
            required
            hint="Please provide a clear picture of a utility bill or a tenancy agreement."
            fileName={draft.proofOfAddressFileName}
            onPick={(uri, fileName) => {
              onChange(uri);
              patchDraft({ proofOfAddressUri: uri, proofOfAddressFileName: fileName });
            }}
            onRemove={() => {
              onChange("");
              patchDraft({ proofOfAddressUri: null, proofOfAddressFileName: null });
            }}
            onError={(message) => setError("proofOfAddressUri", { message })}
            error={errors.proofOfAddressUri?.message}
          />
        )}
      />
    </OnboardingLayout>
  );
}
