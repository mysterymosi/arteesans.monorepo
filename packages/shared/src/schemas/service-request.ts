import { z } from "zod";
import { URGENCY_LEVELS } from "../constants/status";

export const serviceRequestSchema = z.object({
  categorySlug: z.string().min(1, "Select a service category"),
  description: z.string().trim().min(10, "Describe the job in at least 10 characters"),
  urgency: z.enum(URGENCY_LEVELS),
  preferredTime: z.coerce.date().optional(),
  budget: z.number().positive().optional(),
  address: z.string().trim().min(5, "Add the service address"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  mediaPaths: z.array(z.string()).max(5).default([]),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
