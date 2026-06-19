import { z } from "zod";
import {
  REQUEST_STATUSES,
  URGENCY_LEVELS,
  VERIFICATION_STATUSES,
} from "../constants/status";

export const adminActionSchema = z.object({
  actionType: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
  metadata: z.record(z.unknown()).optional(),
});

export type AdminActionInput = z.infer<typeof adminActionSchema>;

export const rejectArtisanSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().trim().min(3, "Provide a rejection reason"),
});

export type RejectArtisanInput = z.infer<typeof rejectArtisanSchema>;

export const requestMoreInfoSchema = z.object({
  userId: z.string().uuid(),
  note: z.string().trim().min(3, "Provide details for the artisan"),
});

export type RequestMoreInfoInput = z.infer<typeof requestMoreInfoSchema>;

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().trim().optional(),
  startingPriceMin: z.coerce.number().min(0).optional().nullable(),
  startingPriceMax: z.coerce.number().min(0).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const requestFiltersSchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  urgency: z.enum(URGENCY_LEVELS).optional(),
  categoryId: z.string().uuid().optional(),
});

export type RequestFiltersInput = z.infer<typeof requestFiltersSchema>;

export const artisanApplicationFiltersSchema = z.object({
  status: z.enum(VERIFICATION_STATUSES).optional(),
});

export type ArtisanApplicationFiltersInput = z.infer<
  typeof artisanApplicationFiltersSchema
>;

export type AdminUserSummary = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
};

export type ServiceRequestListItem = {
  id: string;
  description: string;
  status: (typeof REQUEST_STATUSES)[number];
  urgency: (typeof URGENCY_LEVELS)[number];
  address: string;
  createdAt: string;
  categoryName: string;
  customerName: string;
};

export type ServiceRequestDetail = ServiceRequestListItem & {
  budget: number | null;
  preferredTime: string | null;
  mediaPaths: string[];
  mediaUrls: string[];
  customer: AdminUserSummary;
  latitude: number | null;
  longitude: number | null;
};

export type ArtisanApplicationListItem = {
  profileId: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  verificationStatus: (typeof VERIFICATION_STATUSES)[number];
  primarySkill: string | null;
  state: string | null;
  submittedAt: string;
};

export type ArtisanApplicationDetail = ArtisanApplicationListItem & {
  bio: string | null;
  yearsExperience: string | null;
  availability: string | null;
  address: string | null;
  documents: Array<{
    id: string;
    docType: string;
    fileName: string | null;
    url: string;
  }>;
};

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  startingPriceMin: number | null;
  startingPriceMax: number | null;
  sortOrder: number;
  isActive: boolean;
};

export type DashboardStats = {
  matchingRequests: number;
  pendingArtisans: number;
  activeJobs: number;
};

export type ActionState = {
  error?: string;
  success?: string;
};
