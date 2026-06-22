import type {
  RequestFiltersInput,
  ServiceRequestDetail,
  ServiceRequestListItem,
} from "@arteesans/shared";
import { formatName } from "@/lib/format";
import {
  normalizePagination,
  paginationRange,
  toPageCount,
  type PaginatedResult,
  type PaginationParams,
} from "@/lib/pagination";
import { createSignedUrls } from "@/lib/supabase/storage";
import { createServiceClient } from "@/lib/supabase/server";

export async function getServiceRequests(
  filters: RequestFiltersInput = {},
  paginationInput: Partial<PaginationParams> = {},
): Promise<PaginatedResult<ServiceRequestListItem>> {
  const service = createServiceClient();
  const pagination = normalizePagination(paginationInput);
  const { from, to } = paginationRange(pagination);

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
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.urgency) {
    query = query.eq("urgency", filters.urgency);
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    return {
      data: [],
      page: pagination.page,
      pageSize: pagination.pageSize,
      pageCount: 1,
      total: 0,
    };
  }
  const total = count ?? 0;

  return {
    data: data.map((row) => {
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
    }),
    page: pagination.page,
    pageSize: pagination.pageSize,
    pageCount: toPageCount(total, pagination.pageSize),
    total,
  };
}

export async function getServiceRequestDetail(
  requestId: string,
): Promise<ServiceRequestDetail | null> {
  const service = createServiceClient();

  const { data, error } = await service
    .from("admin_service_request_details")
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
      latitude,
      longitude,
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
    latitude: data.latitude,
    longitude: data.longitude,
    customer: {
      id: customer?.id ?? "",
      firstName: customer?.first_name ?? null,
      lastName: customer?.last_name ?? null,
      email: customer?.email ?? null,
      phone: customer?.phone ?? null,
    },
  };
}
