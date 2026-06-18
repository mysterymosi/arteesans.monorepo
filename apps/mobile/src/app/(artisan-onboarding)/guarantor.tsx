import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { router } from "expo-router";
import { artisanGuarantorsSchema, type ArtisanGuarantorsInput } from "@arteesans/shared";
import { Button, FormInput, Text } from "@/components/ui";
import {
  OnboardingLayout,
  useOnboardingDraft,
  useSubmitArtisanOnboardingMutation,
} from "@/features/artisan-onboarding";
import { routes } from "@/lib/routes";
import { useAuthSession } from "@/providers/auth-provider";
import { normalizePhone } from "@/lib/phone";

function GuarantorFields({
  prefix,
  control,
}: {
  prefix: "firstGuarantor" | "secondGuarantor";
  control: ReturnType<typeof useForm<ArtisanGuarantorsInput>>["control"];
}) {
  return (
    <View className="gap-2">
      <FormInput control={control} name={`${prefix}.fullName`} label="Full Name" placeholder="enter full name" />
      <FormInput
        control={control}
        name={`${prefix}.email`}
        label="Email Address"
        placeholder="email address"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormInput
        control={control}
        name={`${prefix}.phone`}
        label="Phone Number"
        placeholder="phone number"
        keyboardType="phone-pad"
      />
      <FormInput
        control={control}
        name={`${prefix}.address`}
        label="Address"
        placeholder="enter your address"
      />
    </View>
  );
}

/** Guarantor Information — Figma 36:2392 */
export default function ArtisanOnboardingGuarantor() {
  const { session } = useAuthSession();
  const { draft, patchDraft } = useOnboardingDraft();
  const { mutate, isPending } = useSubmitArtisanOnboardingMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ArtisanGuarantorsInput>({
    resolver: zodResolver(artisanGuarantorsSchema),
    defaultValues: {
      firstGuarantor: draft.firstGuarantor,
      secondGuarantor: draft.secondGuarantor,
    },
  });

  const onSubmit = handleSubmit((values) => {
    const userId = session?.user.id;
    if (!userId) {
      setError("root", { message: "You are not signed in." });
      return;
    }

    if (
      !draft.proofOfAddressUri ||
      !draft.proofOfAddressFileName ||
      !draft.resumeUri ||
      !draft.resumeFileName ||
      !draft.facePhotoUri ||
      !draft.availability
    ) {
      setError("root", { message: "Complete the previous onboarding steps first." });
      return;
    }

    patchDraft({
      firstGuarantor: values.firstGuarantor,
      secondGuarantor: values.secondGuarantor,
    });

    mutate(
      {
        yearsExperience: draft.yearsExperience,
        skillSlugs: draft.skillSlugs,
        availability: draft.availability,
        bio: draft.bio,
        proofOfAddressUri: draft.proofOfAddressUri,
        proofOfAddressFileName: draft.proofOfAddressFileName,
        resumeUri: draft.resumeUri,
        resumeFileName: draft.resumeFileName,
        facePhotoUri: draft.facePhotoUri,
        guarantors: {
          firstGuarantor: {
            ...values.firstGuarantor,
            phone: normalizePhone(values.firstGuarantor.phone),
          },
          secondGuarantor: {
            ...values.secondGuarantor,
            phone: normalizePhone(values.secondGuarantor.phone),
          },
        },
      },
      {
        onSuccess: () => router.replace(routes.artisan),
        onError: (error) => setError("root", { message: error.message }),
      },
    );
  });

  return (
    <OnboardingLayout
      title="Guarantor Information"
      subtitle="Provide your guarantor contact details"
      backHref={routes.artisanOnboarding.faceSuccess}
      footer={
        <View className="gap-2">
          {errors.root?.message ? (
            <Text className="text-sm text-danger">{errors.root.message}</Text>
          ) : null}
          <Button title="Complete" loading={isPending} onPress={onSubmit} />
        </View>
      }
    >
      <View className="gap-4">
        <Text className="font-medium text-base text-ink">First Guarantor</Text>
        <GuarantorFields prefix="firstGuarantor" control={control} />
      </View>

      <View className="gap-4">
        <Text className="font-medium text-base text-ink">Second Guarantor</Text>
        <GuarantorFields prefix="secondGuarantor" control={control} />
      </View>
    </OnboardingLayout>
  );
}
