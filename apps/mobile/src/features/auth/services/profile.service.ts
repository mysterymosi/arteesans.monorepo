import type { ProfileCompletion } from "@arteesans/shared";
import { geocodeAddress } from "@/lib/geocoding";
import { supabase } from "@/lib/supabase";
import type { AuthResult, UserProfile } from "@/features/auth/types";

async function persistCustomerDefaultAddress(
  locationText: string,
  coords?: { latitude: number; longitude: number },
): Promise<string | undefined> {
  const trimmed = locationText.trim();
  if (!trimmed) return undefined;

  const geocoded = await geocodeAddress(trimmed);
  const line1 = geocoded?.line1 ?? trimmed;
  const state = geocoded?.state ?? null;
  const cityLga = geocoded?.cityLga ?? null;
  const latitude = coords?.latitude ?? geocoded?.coords.latitude ?? null;
  const longitude = coords?.longitude ?? geocoded?.coords.longitude ?? null;

  const { error } = await supabase.rpc(
    "upsert_customer_default_address" as never,
    {
      p_line1: line1,
      p_state: state,
      p_city_lga: cityLga,
      p_latitude: latitude,
      p_longitude: longitude,
    } as never,
  );

  if (error) return error.message;
  return undefined;
}

export async function fetchProfile(
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

export async function persistProfileFromMetadata(): Promise<
  string | undefined
> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return authError?.message ?? "You are not signed in.";
  }

  const metadata = user.user_metadata ?? {};
  const role = metadata.role === "artisan" ? "artisan" : "customer";

  const { error: userError } = await supabase.from("users").upsert({
    id: user.id,
    role,
    first_name: metadata.first_name ?? null,
    last_name: metadata.last_name ?? null,
    phone: metadata.phone ?? null,
    email: user.email ?? null,
  });

  if (userError) {
    return userError.message;
  }

  if (role === "customer") {
    const { error } = await supabase
      .from("customer_profiles")
      .upsert({ user_id: user.id }, { onConflict: "user_id" });
    if (error) return error.message;

    const location =
      typeof metadata.location === "string" ? metadata.location : "";
    const latitude =
      typeof metadata.latitude === "number" ? metadata.latitude : undefined;
    const longitude =
      typeof metadata.longitude === "number" ? metadata.longitude : undefined;
    const coords =
      latitude !== undefined && longitude !== undefined
        ? { latitude, longitude }
        : undefined;
    const addressError = await persistCustomerDefaultAddress(location, coords);
    if (addressError) return addressError;
  } else {
    const { error } = await supabase
      .from("artisan_profiles")
      .upsert(
        { user_id: user.id, address: metadata.location ?? null },
        { onConflict: "user_id" },
      );
    if (error) return error.message;
  }

  return undefined;
}

export async function completeProfile(
  input: ProfileCompletion,
): Promise<AuthResult> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: authError?.message ?? "You are not signed in." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      role: input.role,
    },
  });

  if (updateError) {
    return { error: updateError.message };
  }

  const persistError = await persistProfileFromMetadata();
  if (persistError) return { error: persistError };

  return {};
}
