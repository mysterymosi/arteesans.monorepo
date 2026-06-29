import Link from "next/link";
import type { ServiceRequestDetail } from "@arteesans/shared";
import {
  CalendarIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import { DetailBackButton } from "@/components/detail-back-button";
import {
  RequestStatusBadge,
  RequestUrgencyBadge,
} from "@/components/status-badge";
import { Button } from "@/components/ui/button";

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

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function FieldPair({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

export function RequestDetailView({ request }: { request: ServiceRequestDetail }) {
  const mapUrl =
    request.latitude != null && request.longitude != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${request.longitude - 0.01}%2C${request.latitude - 0.01}%2C${request.longitude + 0.01}%2C${request.latitude + 0.01}&layer=mapnik&marker=${request.latitude}%2C${request.longitude}`
      : null;

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-6">
      <DetailBackButton href="/requests">Requests</DetailBackButton>
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="grid gap-5 p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
          <div className="grid size-16 place-items-center rounded-lg bg-accent text-primary">
            <FileTextIcon className="size-8" />
          </div>
          <div className="min-w-0">
            <h1 className="mt-1 text-2xl font-semibold leading-tight">
              {request.categoryName} request
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              <span>Customer: {request.customerName}</span>
              <span>·</span>
              <span>Category: {request.categoryName}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <RequestStatusBadge status={request.status} />
              <RequestUrgencyBadge urgency={request.urgency} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <div className="rounded-lg border bg-background px-4 py-3">
              <div className="text-xs text-muted-foreground">Budget</div>
              <div className="mt-1 text-lg font-semibold">
                {formatCurrency(request.budget)}
              </div>
            </div>
            <div className="rounded-lg border bg-background px-4 py-3">
              <div className="text-xs text-muted-foreground">Preferred time</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="size-4 text-muted-foreground" />
                {formatDate(request.preferredTime)}
              </div>
            </div>
            {request.status === "matching" ? (
              <Button
                nativeButton={false}
                render={<Link href={`/requests/${request.id}/match`} />}
                variant="outline"
                className="px-9"
              >
                Admin override
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <DetailCard title="Request Details">
            <dl className="grid gap-x-10 gap-y-5 md:grid-cols-2">
              <FieldPair label="Category" value={request.categoryName} />
              <FieldPair label="Status" value={<RequestStatusBadge status={request.status} />} />
              <FieldPair label="Urgency" value={<RequestUrgencyBadge urgency={request.urgency} />} />
              <FieldPair label="Budget" value={formatCurrency(request.budget)} />
              <FieldPair label="Preferred time" value={formatDate(request.preferredTime)} />
              <FieldPair label="Created" value={formatDate(request.createdAt)} />
              <FieldPair label="Address" value={request.address} />
              <FieldPair
                label="Description"
                value={<span className="leading-5">{request.description}</span>}
              />
            </dl>
          </DetailCard>

          <DetailCard title="Location">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem]">
              {mapUrl ? (
                <iframe
                  title="Request location map"
                  src={mapUrl}
                  className="h-44 w-full rounded-md border"
                />
              ) : (
                <div className="grid h-44 place-items-center rounded-md border bg-muted text-sm text-muted-foreground">
                  No map coordinates captured
                </div>
              )}
              <dl className="grid gap-4 text-sm">
                <FieldPair label="Address" value={request.address} />
                <FieldPair
                  label="Coordinates"
                  value={
                    request.latitude != null && request.longitude != null
                      ? `${request.latitude.toFixed(4)}, ${request.longitude.toFixed(4)}`
                      : "Not available"
                  }
                />
              </dl>
            </div>
          </DetailCard>

          <DetailCard title="Media">
            {request.mediaUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {request.mediaUrls.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-md border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Request media" className="aspect-video w-full object-cover" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No photos uploaded.</p>
            )}
          </DetailCard>
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          <DetailCard title="Customer Contact">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-muted text-sm font-medium">
                {request.customerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="font-medium">{request.customerName}</div>
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MailIcon className="size-4 text-muted-foreground" />
                {request.customer.email ?? "No email"}
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-muted-foreground" />
                {request.customer.phone ?? "No phone"}
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-muted-foreground" />
                {request.address}
              </div>
            </div>
          </DetailCard>
        </aside>
      </div>
    </div>
  );
}
