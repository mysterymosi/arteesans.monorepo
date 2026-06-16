import type { UrgencyLevel } from "./status";

export const URGENCY_OPTIONS: {
  value: UrgencyLevel;
  label: string;
  subtitle: string;
}[] = [
  { value: "emergency", label: "Emergency", subtitle: "Within 1 hour" },
  { value: "urgent", label: "Urgent", subtitle: "Same day" },
  { value: "normal", label: "Normal", subtitle: "Within 24 hours" },
  { value: "flexible", label: "Flexible", subtitle: "Within a week" },
];

export function getUrgencyLabel(urgency: UrgencyLevel): string {
  return URGENCY_OPTIONS.find((option) => option.value === urgency)?.label ?? urgency;
}
