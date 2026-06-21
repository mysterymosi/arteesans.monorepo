import type { VERIFICATION_STATUSES } from "@arteesans/shared";
import { DashboardPage } from "@/components/dashboard-shell";
import {
  ArtisanApplicationDetailView,
  ArtisanApplicationsTable,
  ArtisanStatusFilter,
  getArtisanApplicationDetail,
  getArtisanApplications,
} from "@/features/artisans";

export default async function ArtisanApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: (typeof VERIFICATION_STATUSES)[number];
    userId?: string;
  }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "pending";
  const [applications, detail] = await Promise.all([
    getArtisanApplications(status),
    params.userId ? getArtisanApplicationDetail(params.userId) : Promise.resolve(null),
  ]);

  return (
    <DashboardPage title="Artisan applications">
      <ArtisanStatusFilter current={status} />
      {detail ? <ArtisanApplicationDetailView application={detail} /> : null}
      <ArtisanApplicationsTable applications={applications} />
    </DashboardPage>
  );
}
