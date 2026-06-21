import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-shell";
import { getServiceRequestDetail, RequestDetailView } from "@/features/requests";

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
