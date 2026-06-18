import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { AVAILABILITY_OPTIONS, artisanIdentityStepSchema, type ArtisanIdentityStep } from "@arteesans/shared";
import { Button, Input } from "@/components/ui";
import {
  AVAILABILITY_LABELS,
  FileUploadField,
  MultiSelectField,
  OnboardingLayout,
  SelectField,
  YEARS_EXPERIENCE_OPTIONS,
  useOnboardingDraft,
} from "@/features/artisan-onboarding";
import { routes } from "@/lib/routes";
import { useServiceCategories } from "@/features/service-requests/hooks/use-service-categories";

/** Identity Verification — Figma 36:2353 */
export default function ArtisanOnboardingIdentity() {
  const { draft, patchDraft } = useOnboardingDraft();
  const { data: categories = [] } = useServiceCategories();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ArtisanIdentityStep>({
    resolver: zodResolver(artisanIdentityStepSchema),
    defaultValues: {
      yearsExperience: draft.yearsExperience,
      skillSlugs: draft.skillSlugs,
      availability: draft.availability || undefined,
      bio: draft.bio,
      resumeUri: draft.resumeUri ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    patchDraft({
      yearsExperience: values.yearsExperience,
      skillSlugs: values.skillSlugs,
      availability: values.availability,
      bio: values.bio,
      resumeUri: values.resumeUri,
    });
    router.push(routes.artisanOnboarding.faceVerification);
  });

  return (
    <OnboardingLayout
      title="Identity Verification"
      subtitle="Upload your documents for verification"
      backHref={routes.artisanOnboarding.address}
      footer={<Button title="Next" onPress={onSubmit} className="mt-2" />}
    >
      <Controller
        control={control}
        name="yearsExperience"
        render={({ field: { value, onChange } }) => (
          <SelectField
            label="Years of Experience"
            value={value}
            onChange={onChange}
            options={YEARS_EXPERIENCE_OPTIONS.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            error={errors.yearsExperience?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="skillSlugs"
        render={({ field: { value, onChange } }) => (
          <MultiSelectField
            label="Skills"
            values={value}
            onChange={onChange}
            options={categories.map((category) => ({
              value: category.slug,
              label: category.name,
            }))}
            error={errors.skillSlugs?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="availability"
        render={({ field: { value, onChange } }) => (
          <SelectField
            label="Availability"
            value={value ?? ""}
            onChange={onChange}
            options={AVAILABILITY_OPTIONS.map((option) => ({
              value: option,
              label: AVAILABILITY_LABELS[option],
            }))}
            error={errors.availability?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="bio"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="About"
            placeholder="tell us more about you..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={3}
            className="min-h-[60px]"
            style={{ textAlignVertical: "top" }}
            error={errors.bio?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="resumeUri"
        render={({ field: { value, onChange } }) => (
          <FileUploadField
            title="Your Resume"
            required
            hint="Please provide a clear portrait picture of your resume."
            fileName={draft.resumeFileName}
            onPick={(uri, fileName) => {
              onChange(uri);
              patchDraft({ resumeUri: uri, resumeFileName: fileName });
            }}
            onRemove={() => {
              onChange("");
              patchDraft({ resumeUri: null, resumeFileName: null });
            }}
            onError={(message) => setError("resumeUri", { message })}
            error={errors.resumeUri?.message}
          />
        )}
      />
    </OnboardingLayout>
  );
}
