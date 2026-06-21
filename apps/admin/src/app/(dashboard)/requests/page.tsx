import type { REQUEST_STATUSES, URGENCY_LEVELS } from "@arteesans/shared";
import { DashboardPage } from "@/components/dashboard-shell";
import { getCategoryOptions } from "@/features/categories";
import { getServiceRequests, RequestFilters, RequestsTable } from "@/features/requests";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: (typeof REQUEST_STATUSES)[number];
    urgency?: (typeof URGENCY_LEVELS)[number];
    categoryId?: string;
  }>;
}) {
  const filters = await searchParams;
  const [requests, categories] = await Promise.all([
    getServiceRequests(filters),
    getCategoryOptions(),
  ]);

  return (
    <DashboardPage title="Service requests">
      <RequestFilters
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        current={filters}
      />
      <RequestsTable requests={requests} />
    </DashboardPage>
  );
}
