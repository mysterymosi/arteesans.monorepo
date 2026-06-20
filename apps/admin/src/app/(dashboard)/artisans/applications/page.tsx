import type { VERIFICATION_STATUSES } from "@arteesans/shared";
import { DashboardPage } from "@/components/dashboard-shell";
import { ArtisanApplicationDetailView } from "@/features/admin/components/artisan-application-detail";
import {
  ArtisanApplicationsTable,
  ArtisanStatusFilter,
} from "@/features/admin/components/artisan-applications-table";
import {
  getArtisanApplicationDetail,
  getArtisanApplications,
} from "@/features/admin/services/artisans.service";

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
