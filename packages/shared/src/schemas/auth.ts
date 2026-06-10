import { z } from "zod";
import { USER_ROLES } from "../constants/status";

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address");

/** Nigerian phone: 0XXXXXXXXXX or +234XXXXXXXXXX */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number");

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter the 6-digit code");

export const profileCompletionSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  phone: phoneSchema,
  role: z.enum(USER_ROLES).exclude(["admin"]),
});

export type ProfileCompletion = z.infer<typeof profileCompletionSchema>;
