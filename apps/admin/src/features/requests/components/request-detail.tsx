import Link from "next/link";
import type { ServiceRequestDetail } from "@arteesans/shared";
import {
  RequestStatusBadge,
  RequestUrgencyBadge,
} from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(value: string | null) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCurrency(value: number | null) {
  if (value == null) return "Not specified";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RequestDetailView({ request }: { request: ServiceRequestDetail }) {
  const mapUrl =
    request.latitude != null && request.longitude != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${request.longitude - 0.01}%2C${request.latitude - 0.01}%2C${request.longitude + 0.01}%2C${request.latitude + 0.01}&layer=mapnik&marker=${request.latitude}%2C${request.longitude}`
      : null;

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <RequestStatusBadge status={request.status} />
        <RequestUrgencyBadge urgency={request.urgency} />
        {request.status === "matching" ? (
          <Button
            nativeButton={false}
            render={<Link href={`/requests/${request.id}/match`} />}
            size="sm"
          >
            Match artisan
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request details</CardTitle>
            <CardDescription>{request.categoryName}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>{request.description}</p>
            <div>
              <span className="font-medium">Address:</span> {request.address}
            </div>
            <div>
              <span className="font-medium">Budget:</span> {formatCurrency(request.budget)}
            </div>
            <div>
              <span className="font-medium">Preferred time:</span>{" "}
              {formatDate(request.preferredTime)}
            </div>
            <div>
              <span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="font-medium">{request.customerName}</div>
            <div>{request.customer.email ?? "No email"}</div>
            <div>{request.customer.phone ?? "No phone"}</div>
          </CardContent>
        </Card>
      </div>

      {request.mediaUrls.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {request.mediaUrls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Request media" className="aspect-square w-full object-cover" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {mapUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              title="Request location map"
              src={mapUrl}
              className="h-72 w-full rounded-lg border"
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
