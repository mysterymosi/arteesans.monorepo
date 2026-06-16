import { z } from "zod";
import { URGENCY_LEVELS } from "@arteesans/shared";

export const createRequestFormSchema = z.object({
  categoryId: z.string().min(1, "Select a service category"),
  categorySlug: z.string().min(1),
  description: z
    .string()
    .trim()
    .min(10, "Describe the job in at least 10 characters"),
  urgency: z.enum(URGENCY_LEVELS),
  preferredTime: z.string().optional(),
  budget: z.string().optional(),
  address: z.string().trim().min(5, "Add the service address"),
  latitude: z.number(),
  longitude: z.number(),
  photoUris: z.array(z.string()).max(5),
});

export type CreateRequestFormValues = z.infer<typeof createRequestFormSchema>;

export function parseBudget(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parsePreferredTime(
  value: string | undefined,
): Date | undefined {
  if (!value?.trim()) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
