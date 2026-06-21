import { SectionCards } from "@/components/section-cards";
import { DashboardPage } from "@/components/dashboard-shell";
import { getDashboardStats } from "@/features/dashboard";

export default async function OverviewPage() {
  const stats = await getDashboardStats();

  return (
    <DashboardPage title="Overview">
      <SectionCards stats={stats} />
    </DashboardPage>
  );
}
