function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return trimmed;
}

function optional(value: string | undefined): string {
  return value?.trim() ?? "";
}

export const env = {
  supabase: {
    url: required("EXPO_PUBLIC_SUPABASE_URL", process.env.EXPO_PUBLIC_SUPABASE_URL),
    anonKey: required(
      "EXPO_PUBLIC_SUPABASE_ANON_KEY",
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    ),
  },
  googleMapsApiKey: optional(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY),
} as const;
