import { supabase } from "@/lib/supabase";
import type { Coordinates } from "@/lib/geo";

export type CustomerDefaultAddress = {
  line1: string;
  city_lga: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type SaveCustomerDefaultAddressInput = {
  line1: string;
  cityLga?: string | null;
  state?: string | null;
  coords?: Coordinates | null;
};

function parseLocationCoords(location: unknown): {
  latitude: number;
  longitude: number;
} | null {
  if (!location) return null;

  let geo: { type?: string; coordinates?: number[] };
  try {
    geo =
      typeof location === "string"
        ? (JSON.parse(location) as { type?: string; coordinates?: number[] })
        : (location as { type?: string; coordinates?: number[] });
  } catch {
    return null;
  }

  if (geo.type !== "Point" || !Array.isArray(geo.coordinates) || geo.coordinates.length < 2) {
    return null;
  }

  const [longitude, latitude] = geo.coordinates;
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;

  return { latitude, longitude };
}

export async function fetchCustomerDefaultAddress(): Promise<CustomerDefaultAddress | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("customer_profiles")
    .select(
      "default_address:addresses!customer_profiles_default_address_fkey(line1, city_lga, state, location)",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  const address = data?.default_address;
  if (!address || Array.isArray(address)) return null;

  const coords = parseLocationCoords(address.location);

  return {
    line1: address.line1,
    city_lga: address.city_lga,
    state: address.state,
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
  };
}

export async function saveCustomerDefaultAddress(
  input: SaveCustomerDefaultAddressInput,
): Promise<void> {
  const { error } = await supabase.rpc(
    "upsert_customer_default_address" as never,
    {
      p_line1: input.line1,
      p_state: input.state ?? null,
      p_city_lga: input.cityLga ?? null,
      p_latitude: input.coords?.latitude ?? null,
      p_longitude: input.coords?.longitude ?? null,
    } as never,
  );

  if (error) throw error;
}

export function formatDefaultAddressText(
  address: CustomerDefaultAddress | null | undefined,
): string | null {
  if (!address) return null;

  const parts = [address.line1, address.city_lga, address.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export function formatAddressLocationLabel(
  address: CustomerDefaultAddress | null | undefined,
): string | null {
  if (!address) return null;

  const parts = [address.city_lga, address.state].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");

  const line1 = address.line1?.trim();
  return line1 || null;
}
