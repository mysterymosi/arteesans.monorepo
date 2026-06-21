import Link from "next/link";
import type {
  REQUEST_STATUSES,
  URGENCY_LEVELS,
} from "@arteesans/shared";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ServiceRequestListItem } from "@arteesans/shared";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RequestsTable({ requests }: { requests: ServiceRequestListItem[] }) {
  if (requests.length === 0) {
    return (
      <p className="px-4 text-sm text-muted-foreground lg:px-6">
        No service requests match the current filters.
      </p>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="font-medium">{request.customerName}</div>
                <div className="line-clamp-1 text-sm text-muted-foreground">
                  {request.description}
                </div>
              </TableCell>
              <TableCell>{request.categoryName}</TableCell>
              <TableCell>
                <Badge variant="outline">{request.status}</Badge>
              </TableCell>
              <TableCell>{request.urgency}</TableCell>
              <TableCell>{formatDate(request.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/requests/${request.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function RequestFilters({
  categories,
  current,
}: {
  categories: Array<{ id: string; name: string }>;
  current: {
    status?: (typeof REQUEST_STATUSES)[number];
    urgency?: (typeof URGENCY_LEVELS)[number];
    categoryId?: string;
  };
}) {
  return (
    <form className="flex flex-wrap gap-3 px-4 lg:px-6" method="get">
      <select
        name="status"
        defaultValue={current.status ?? ""}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">All statuses</option>
        <option value="matching">matching</option>
        <option value="submitted">submitted</option>
        <option value="matched">matched</option>
        <option value="confirmed">confirmed</option>
        <option value="cancelled">cancelled</option>
      </select>
      <select
        name="urgency"
        defaultValue={current.urgency ?? ""}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">All urgency</option>
        <option value="emergency">emergency</option>
        <option value="urgent">urgent</option>
        <option value="normal">normal</option>
        <option value="flexible">flexible</option>
      </select>
      <select
        name="categoryId"
        defaultValue={current.categoryId ?? ""}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Apply filters
      </button>
    </form>
  );
}
