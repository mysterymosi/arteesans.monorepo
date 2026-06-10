import type { RequestStatus } from "@arteesans/shared";
import { Badge } from "./badge";

const statusConfig: Record<RequestStatus, { label: string; tone: "primary" | "success" | "warning" | "danger" | "neutral" }> = {
  submitted: { label: "Submitted", tone: "neutral" },
  matching: { label: "Matching", tone: "primary" },
  matched: { label: "Matched", tone: "primary" },
  confirmed: { label: "Confirmed", tone: "primary" },
  accepted: { label: "Accepted", tone: "primary" },
  on_the_way: { label: "On the way", tone: "warning" },
  arrived: { label: "Arrived", tone: "warning" },
  in_progress: { label: "In Progress", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  disputed: { label: "Disputed", tone: "danger" },
};

export function StatusChip({ status }: { status: RequestStatus }) {
  const { label, tone } = statusConfig[status];
  return <Badge label={label} tone={tone} />;
}
