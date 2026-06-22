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

export function RequestStatusBadge({
  status,
}: {
  status: ServiceRequestListItem["status"];
}) {
  return <Badge variant={requestStatusTones[status]}>{status}</Badge>;
}

export function RequestUrgencyBadge({
  urgency,
}: {
  urgency: ServiceRequestListItem["urgency"];
}) {
  return <Badge variant={urgencyTones[urgency]}>{urgency}</Badge>;
}

export function VerificationStatusBadge({
  status,
}: {
  status: ArtisanApplicationListItem["verificationStatus"];
}) {
  return <Badge variant={verificationTones[status]}>{status}</Badge>;
}

export function CategoryStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "secondary"}>
      {isActive ? "active" : "inactive"}
    </Badge>
  );
}
