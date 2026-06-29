import type { Coordinates } from "@/lib/geo";
import { geocodeAddress } from "@/lib/geocoding";
import type { SelectedAddress } from "../types/selected-address";

export function splitPrediction(description: string) {
  const [title, ...rest] = description.split(",");
  return {
    title: title?.trim() || description,
    subtitle: rest.join(",").trim(),
  };
}

function fallbackLine1(address: string) {
  return address.split(",")[0]?.trim() || address.trim();
}

export async function resolveAddress(
  address: string,
  coords?: Coordinates,
): Promise<SelectedAddress | null> {
  const trimmed = address.trim();
  if (trimmed.length < 3) return null;

  const geocoded = await geocodeAddress(trimmed);
  const resolvedCoords = coords ?? geocoded?.coords ?? null;
  const displayAddress = geocoded?.formattedAddress ?? trimmed;

  return {
    displayAddress,
    line1: geocoded?.line1 ?? fallbackLine1(displayAddress),
    cityLga: geocoded?.cityLga ?? null,
    state: geocoded?.state ?? null,
    coords: resolvedCoords,
  };
}
