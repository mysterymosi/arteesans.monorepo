export const USER_ROLES = ["customer", "artisan", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const URGENCY_LEVELS = ["emergency", "urgent", "normal", "flexible"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

/** Full lifecycle; Phase 1 uses submitted/matching/matched, Phase 2 adds the rest. */
export const REQUEST_STATUSES = [
  "submitted",
  "matching",
  "matched",
  "confirmed",
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "completed",
  "cancelled",
  "disputed",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const VERIFICATION_STATUSES = ["pending", "approved", "rejected", "more_info"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const AVAILABILITY_OPTIONS = [
  "full_time",
  "part_time",
  "weekends_only",
  "flexible",
  "on_demand",
] as const;
export type Availability = (typeof AVAILABILITY_OPTIONS)[number];
