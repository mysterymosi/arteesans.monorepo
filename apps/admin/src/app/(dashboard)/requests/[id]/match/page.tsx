import Link from "next/link";
import { DashboardPage } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function RequestMatchPlaceholderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardPage title="Match artisan">
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Matching coming in Phase 1.6</CardTitle>
            <CardDescription>
              Ranked artisan suggestions and manual assignment will be built in the
              matching epic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              nativeButton={false}
              render={<Link href={`/requests/${id}`} />}
              variant="outline"
            >
              Back to request
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  );
}
