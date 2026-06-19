import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-shell";
import { RequestDetailView } from "@/features/admin/components/request-detail";
import { getServiceRequestDetail } from "@/features/admin/queries";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getServiceRequestDetail(id);

  if (!request) {
    notFound();
  }

  return (
    <DashboardPage title="Request detail">
      <RequestDetailView request={request} />
    </DashboardPage>
  );
}
