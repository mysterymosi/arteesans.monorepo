import Link from "next/link";
import type { ArtisanApplicationListItem } from "@arteesans/shared";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ArtisanApplicationsTable({
  applications,
}: {
  applications: ArtisanApplicationListItem[];
}) {
  if (applications.length === 0) {
    return (
      <p className="px-4 text-sm text-muted-foreground lg:px-6">
        No artisan applications match the current filter.
      </p>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artisan</TableHead>
            <TableHead>Skill</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.profileId}>
              <TableCell>
                <div className="font-medium">{application.name}</div>
                <div className="text-sm text-muted-foreground">
                  {application.email ?? application.phone ?? "No contact"}
                </div>
              </TableCell>
              <TableCell>{application.primarySkill ?? "—"}</TableCell>
              <TableCell>{application.state ?? "—"}</TableCell>
              <TableCell>
                <Badge variant="outline">{application.verificationStatus}</Badge>
              </TableCell>
              <TableCell>{formatDate(application.submittedAt)}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/artisans/applications/${application.userId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Review
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ArtisanStatusFilter({ current }: { current?: string }) {
  return (
    <form className="px-4 lg:px-6" method="get">
      <select
        name="status"
        defaultValue={current ?? "pending"}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
        <option value="more_info">more_info</option>
      </select>
      <button
        type="submit"
        className="ml-2 h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Apply
      </button>
    </form>
  );
}
