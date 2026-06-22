import Link from "next/link";
import { DashboardPage } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function RequestMatchPlaceholderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardPage title="Match artisan">
      <div className="px-4 lg:px-6">
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>Matching coming in Phase 1.6</EmptyTitle>
            <EmptyDescription>
              Ranked artisan suggestions and manual assignment will be built in the
              matching epic.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              nativeButton={false}
              render={<Link href={`/requests/${id}`} />}
              variant="outline"
            >
              Back to request
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </DashboardPage>
  );
}
