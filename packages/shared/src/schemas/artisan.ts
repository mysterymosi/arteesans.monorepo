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
