/** Format amount as Nigerian Naira. */
export function formatNaira(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

/** Short date for request cards, e.g. "Today 12:00PM". */
export function formatRequestDate(iso: string | null | undefined): string {
  if (!iso) return "Flexible";
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today ${time}`;
  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Display name from user profile fields. */
export function formatPersonName(firstName: string | null | undefined, lastName: string | null | undefined): string {
  return [firstName, lastName].filter(Boolean).join(" ") || "Artisan";
}

/** Human-readable distance, e.g. "450 m" or "1.2 km away". */
export function formatDistance(meters: number | null | undefined, options?: { away?: boolean }): string {
  if (meters == null) return "Nearby";
  const suffix = options?.away ? " away" : "";
  if (meters < 1000) return `${Math.round(meters)} m${suffix}`;
  return `${(meters / 1000).toFixed(1)} km${suffix}`;
}
