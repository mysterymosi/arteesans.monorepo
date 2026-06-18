import { z } from "zod";
import { AVAILABILITY_OPTIONS } from "../constants/status";

export const artisanOnboardingSchema = z.object({
  primarySkillSlug: z.string().min(1, "Select your primary skill"),
  additionalSkillSlugs: z.array(z.string()).max(5).default([]),
  yearsExperience: z.string().min(1, "Select years of experience"),
  bio: z.string().trim().min(20, "Describe your work in at least 20 characters"),
  state: z.string().trim().min(2, "State is required"),
  cityLga: z.string().trim().min(2, "City/LGA is required"),
  address: z.string().trim().min(5, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  availability: z.enum(AVAILABILITY_OPTIONS),
});

export type ArtisanOnboarding = z.infer<typeof artisanOnboardingSchema>;

export const guarantorSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(10, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Address is required"),
});

export const artisanGuarantorsSchema = z.object({
  firstGuarantor: guarantorSchema,
  secondGuarantor: guarantorSchema,
});

export type GuarantorInput = z.infer<typeof guarantorSchema>;
export type ArtisanGuarantorsInput = z.infer<typeof artisanGuarantorsSchema>;

export const artisanAddressStepSchema = z.object({
  proofOfAddressUri: z.string().min(1, "Proof of address is required"),
});

export const artisanIdentityStepSchema = z.object({
  yearsExperience: z.string().min(1, "Select years of experience"),
  skillSlugs: z.array(z.string()).min(1, "Select at least one skill"),
  availability: z.enum(AVAILABILITY_OPTIONS, {
    errorMap: () => ({ message: "Select availability" }),
  }),
  bio: z.string().trim().min(20, "Describe your work in at least 20 characters"),
  resumeUri: z.string().min(1, "Resume is required"),
});

export type ArtisanAddressStep = z.infer<typeof artisanAddressStepSchema>;
export type ArtisanIdentityStep = z.infer<typeof artisanIdentityStepSchema>;
