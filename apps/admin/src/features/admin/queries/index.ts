import type {
  ArtisanApplicationDetail,
  ArtisanApplicationListItem,
  CategoryListItem,
  DashboardStats,
  RequestFiltersInput,
  ServiceRequestDetail,
  ServiceRequestListItem,
} from "@arteesans/shared";
import { createServiceClient } from "@/lib/supabase/server";

function formatName(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email || "Unknown";
}

function parsePoint(location: unknown): {
  latitude: number | null;
  longitude: number | null;
} {
  if (!location || typeof location !== "object") {
    return { latitude: null, longitude: null };
  }

  const geo = location as { type?: string; coordinates?: number[] };
  if (
    geo.type === "Point" &&
    Array.isArray(geo.coordinates) &&
    geo.coordinates.length >= 2
  ) {
    return {
      longitude: geo.coordinates[0] ?? null,
      latitude: geo.coordinates[1] ?? null,
    };
  }

  return { latitude: null, longitude: null };
}

async function createSignedUrls(bucket: string, paths: string[]) {
  if (paths.length === 0) {
    return [];
  }

  const service = createServiceClient();
  const { data, error } = await service.storage
    .from(bucket)
    .createSignedUrls(paths, 3600);

  if (error || !data) {
    return [];
  }

  return data.map((item) => item.signedUrl).filter(Boolean) as string[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const service = createServiceClient();

  const [matchingResult, pendingResult, activeResult] = await Promise.all([
    service
      .from("service_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "matching"),
    service
      .from("artisan_profiles")
      .select("id", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    service
      .from("service_requests")
      .select("id", { count: "exact", head: true })
      .in("status", [
        "matched",
        "confirmed",
        "accepted",
        "on_the_way",
        "arrived",
        "in_progress",
      ]),
  ]);

  return {
    matchingRequests: matchingResult.count ?? 0,
    pendingArtisans: pendingResult.count ?? 0,
    activeJobs: activeResult.count ?? 0,
  };
}

export async function getServiceRequests(
  filters: RequestFiltersInput = {},
): Promise<ServiceRequestListItem[]> {
  const service = createServiceClient();

  let query = service
    .from("service_requests")
    .select(
      `
      id,
      description,
      status,
      urgency,
      address,
      created_at,
      category:service_categories(name),
      customer:users!service_requests_customer_id_fkey(first_name, last_name, email)
    `,
    )
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.urgency) {
    query = query.eq("urgency", filters.urgency);
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const category = Array.isArray(row.category)
      ? row.category[0]
      : row.category;
    const customer = Array.isArray(row.customer)
      ? row.customer[0]
      : row.customer;

    return {
      id: row.id,
      description: row.description,
      status: row.status,
      urgency: row.urgency,
      address: row.address,
      createdAt: row.created_at,
      categoryName: category?.name ?? "Unknown",
      customerName: formatName(
        customer?.first_name ?? null,
        customer?.last_name ?? null,
        customer?.email ?? null,
      ),
    };
  });
}

export async function getServiceRequestDetail(
  requestId: string,
): Promise<ServiceRequestDetail | null> {
  const service = createServiceClient();

  const { data, error } = await service
    .from("service_requests")
    .select(
      `
      id,
      description,
      status,
      urgency,
      address,
      created_at,
      budget,
      preferred_time,
      media_paths,
      location,
      category:service_categories(name),
      customer:users!service_requests_customer_id_fkey(id, first_name, last_name, email, phone)
    `,
    )
    .eq("id", requestId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const category = Array.isArray(data.category)
    ? data.category[0]
    : data.category;
  const customer = Array.isArray(data.customer)
    ? data.customer[0]
    : data.customer;
  const mediaUrls = await createSignedUrls(
    "request-media",
    data.media_paths ?? [],
  );
  const { latitude, longitude } = parsePoint(data.location);

  return {
    id: data.id,
    description: data.description,
    status: data.status,
    urgency: data.urgency,
    address: data.address,
    createdAt: data.created_at,
    categoryName: category?.name ?? "Unknown",
    customerName: formatName(
      customer?.first_name ?? null,
      customer?.last_name ?? null,
      customer?.email ?? null,
    ),
    budget: data.budget,
    preferredTime: data.preferred_time,
    mediaPaths: data.media_paths ?? [],
    mediaUrls,
    latitude,
    longitude,
    customer: {
      id: customer?.id ?? "",
      firstName: customer?.first_name ?? null,
      lastName: customer?.last_name ?? null,
      email: customer?.email ?? null,
      phone: customer?.phone ?? null,
    },
  };
}

export async function getArtisanApplications(
  status?: ArtisanApplicationListItem["verificationStatus"],
): Promise<ArtisanApplicationListItem[]> {
  const service = createServiceClient();

  let query = service
    .from("artisan_profiles")
    .select(
      `
      id,
      user_id,
      verification_status,
      state,
      created_at,
      user:users!artisan_profiles_user_id_fkey(first_name, last_name, email, phone),
      primary_skill:service_categories!artisan_profiles_primary_skill_category_id_fkey(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("verification_status", status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const user = Array.isArray(row.user) ? row.user[0] : row.user;
    const primarySkill = Array.isArray(row.primary_skill)
      ? row.primary_skill[0]
      : row.primary_skill;

    return {
      profileId: row.id,
      userId: row.user_id,
      name: formatName(
        user?.first_name ?? null,
        user?.last_name ?? null,
        user?.email ?? null,
      ),
      email: user?.email ?? null,
      phone: user?.phone ?? null,
      verificationStatus: row.verification_status,
      primarySkill: primarySkill?.name ?? null,
      state: row.state,
      submittedAt: row.created_at,
    };
  });
}

export async function getArtisanApplicationDetail(
  userId: string,
): Promise<ArtisanApplicationDetail | null> {
  const service = createServiceClient();

  const { data, error } = await service
    .from("artisan_profiles")
    .select(
      `
      id,
      user_id,
      verification_status,
      state,
      created_at,
      bio,
      years_experience,
      availability,
      address,
      user:users!artisan_profiles_user_id_fkey(first_name, last_name, email, phone),
      primary_skill:service_categories!artisan_profiles_primary_skill_category_id_fkey(name),
      verification_documents(id, doc_type, file_name, storage_path)
    `,
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const user = Array.isArray(data.user) ? data.user[0] : data.user;
  const primarySkill = Array.isArray(data.primary_skill)
    ? data.primary_skill[0]
    : data.primary_skill;
  const documents = data.verification_documents ?? [];

  const signedUrls = await createSignedUrls(
    "verification-docs",
    documents.map((doc) => doc.storage_path),
  );

  return {
    profileId: data.id,
    userId: data.user_id,
    name: formatName(
      user?.first_name ?? null,
      user?.last_name ?? null,
      user?.email ?? null,
    ),
    email: user?.email ?? null,
    phone: user?.phone ?? null,
    verificationStatus: data.verification_status,
    primarySkill: primarySkill?.name ?? null,
    state: data.state,
    submittedAt: data.created_at,
    bio: data.bio,
    yearsExperience: data.years_experience,
    availability: data.availability,
    address: data.address,
    documents: documents.map((doc, index) => ({
      id: doc.id,
      docType: doc.doc_type,
      fileName: doc.file_name,
      url: signedUrls[index] ?? "",
    })),
  };
}

export async function getCategories(): Promise<CategoryListItem[]> {
  const service = createServiceClient();
  const { data, error } = await service
    .from("service_categories")
    .select(
      "id, name, slug, description, starting_price_min, starting_price_max, sort_order, is_active",
    )
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    startingPriceMin: row.starting_price_min,
    startingPriceMax: row.starting_price_max,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

export async function getCategoryOptions() {
  const categories = await getCategories();
  return categories.filter((category) => category.isActive);
}
