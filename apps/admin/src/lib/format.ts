export function formatName(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email || "Unknown";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatNaira(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
