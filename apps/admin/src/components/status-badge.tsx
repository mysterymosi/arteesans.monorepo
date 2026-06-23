import type {
  ArtisanApplicationListItem,
  ServiceRequestListItem,
} from "@arteesans/shared";
import { Badge } from "@/components/ui/badge";

type BadgeTone = React.ComponentProps<typeof Badge>["variant"];

const requestStatusTones: Record<ServiceRequestListItem["status"], BadgeTone> = {
  submitted: "warning",
  matching: "info",
  matched: "success",
  confirmed: "success",
  accepted: "success",
  on_the_way: "info",
  arrived: "info",
  in_progress: "info",
  completed: "success",
  cancelled: "destructive",
  disputed: "destructive",
};

const urgencyTones: Record<ServiceRequestListItem["urgency"], BadgeTone> = {
  emergency: "destructive",
  urgent: "warning",
  normal: "secondary",
  flexible: "outline",
};

const verificationTones: Record<
  ArtisanApplicationListItem["verificationStatus"],
  BadgeTone
> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  more_info: "info",
};

function formatStatus(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function RequestStatusBadge({
  status,
}: {
  status: ServiceRequestListItem["status"];
}) {
  return <Badge variant={requestStatusTones[status]}>{formatStatus(status)}</Badge>;
}

export function RequestUrgencyBadge({
  urgency,
}: {
  urgency: ServiceRequestListItem["urgency"];
}) {
  return <Badge variant={urgencyTones[urgency]}>{formatStatus(urgency)}</Badge>;
}

export function VerificationStatusBadge({
  status,
}: {
  status: ArtisanApplicationListItem["verificationStatus"];
}) {
  return <Badge variant={verificationTones[status]}>{formatStatus(status)}</Badge>;
}

export function CategoryStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "secondary"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
