export function formatName(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email || "Unknown";
}
