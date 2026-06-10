/** MVP service categories (PRD section 13). Slugs must match service_categories.slug in the DB. */
export const SERVICE_CATEGORIES = [
  { slug: "plumbing", name: "Plumbing" },
  { slug: "electrical", name: "Electrical" },
  { slug: "carpentry", name: "Carpentry" },
  { slug: "cleaning", name: "Cleaning" },
  { slug: "driving", name: "Driving" },
  { slug: "general-repairs", name: "General Repairs" },
  { slug: "hair-styling", name: "Hair Styling" },
] as const;

export type ServiceCategorySlug = (typeof SERVICE_CATEGORIES)[number]["slug"];
