import { z } from "zod";
import { USER_ROLES } from "../constants/status";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

/** Nigerian phone: 0XXXXXXXXXX or +234XXXXXXXXXX */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number");

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter the 6-digit code");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(2, "Last name is required"),
    email: emailSchema,
    phone: phoneSchema,
    location: z.string().trim().min(3, "Enter your address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(USER_ROLES).exclude(["admin"]),
    acceptedTerms: z
      .boolean()
      .refine((value) => value, "Accept the terms and conditions to continue"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const profileCompletionSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  phone: phoneSchema,
  role: z.enum(USER_ROLES).exclude(["admin"]),
});

export type ProfileCompletion = z.infer<typeof profileCompletionSchema>;
