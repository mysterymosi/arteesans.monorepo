import type { PaginationParams } from "@/lib/pagination";

type QueryValue = string | number | boolean | null | undefined;
type QueryRecord = Record<string, QueryValue>;

export function normalizeQuery(query: QueryRecord) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}

export function withQuery(path: string, query: QueryRecord) {
  const normalizedQuery = normalizeQuery(query);
  return normalizedQuery ? `${path}?${normalizedQuery}` : path;
}

void function listEndpoint(
  path: string,
  query: QueryRecord,
  pagination: PaginationParams,
) {
  return withQuery(path, {
    ...query,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
};

export const endpoints = {
  dashboard: {
    stats: "/api/dashboard/stats",
  },
  categories: {
    list: "/api/categories",
  },
  requests: {
    list: "/api/requests",
    detail: (requestId: string) => `/api/requests/${requestId}`,
  },
  artisanApplications: {
    list: "/api/artisans/applications",
    detail: (userId: string) => `/api/artisans/applications/${userId}`,
  },
} as const;
