import { zodResolver } from "@hookform/resolvers/zod";
import type { ProfileCompletion, SignUpInput } from "@arteesans/shared";
import { profileCompletionSchema, signUpSchema } from "@arteesans/shared";
import type { Resolver } from "react-hook-form";
import { normalizePhone } from "./phone";

export const signUpFormResolver: Resolver<SignUpInput> = (
  values,
  context,
  options,
) =>
  zodResolver(signUpSchema)(
    { ...values, phone: normalizePhone(values.phone) },
    context,
    options,
  );

export const profileFormResolver: Resolver<ProfileCompletion> = (
  values,
  context,
  options,
) =>
  zodResolver(profileCompletionSchema)(
    { ...values, phone: normalizePhone(values.phone) },
    context,
    options,
  );
