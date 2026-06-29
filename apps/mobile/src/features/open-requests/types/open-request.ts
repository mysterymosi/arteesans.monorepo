import type { UrgencyLevel } from "@arteesans/shared";

export type OpenRequest = {
  request_id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  description: string;
  urgency: UrgencyLevel;
  address: string;
  budget: number | null;
  preferred_time: string | null;
  distance_meters: number | null;
  score: number;
  created_at: string;
  interest_status: "pending" | "withdrawn" | "selected" | "declined" | "expired" | null;
};

export type RequestInterest = {
  interest_id: string;
  artisan_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_photo_url: string | null;
  average_rating: number;
  completed_jobs: number;
  city_lga: string | null;
  state: string | null;
  distance_meters: number | null;
  score: number;
  created_at: string;
};
