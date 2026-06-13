/** Local 080... and bare 80... both become +234... */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0/, "");
  return digits ? `+234${digits}` : "";
}
