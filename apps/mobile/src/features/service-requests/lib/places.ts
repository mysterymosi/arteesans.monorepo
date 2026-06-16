import { env } from "@/lib/env";
import type { Coordinates } from "./location";

const GOOGLE_MAPS_API_KEY = env.googleMapsApiKey;

const LAGOS_BIAS: Coordinates = { latitude: 6.5244, longitude: 3.3792 };

export type PlacePrediction = {
  placeId: string;
  description: string;
};

type AutocompleteResponse = {
  status: string;
  predictions?: Array<{
    place_id: string;
    description: string;
  }>;
};

type PlaceDetailsResponse = {
  status: string;
  result?: {
    formatted_address?: string;
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
  };
};

export async function fetchPlacePredictions(
  input: string,
): Promise<PlacePrediction[]> {
  const trimmed = input.trim();
  if (!GOOGLE_MAPS_API_KEY || trimmed.length < 3) return [];

  const params = new URLSearchParams({
    input: trimmed,
    key: GOOGLE_MAPS_API_KEY,
    components: "country:ng",
    location: `${LAGOS_BIAS.latitude},${LAGOS_BIAS.longitude}`,
    radius: "50000",
  });

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
    );
    const data = (await response.json()) as AutocompleteResponse;

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") return [];

    return (data.predictions ?? []).map((prediction) => ({
      placeId: prediction.place_id,
      description: prediction.description,
    }));
  } catch {
    return [];
  }
}

export async function fetchPlaceDetails(placeId: string): Promise<{
  address: string;
  coords: Coordinates;
} | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "formatted_address,geometry",
    key: GOOGLE_MAPS_API_KEY,
  });

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
    );
    const data = (await response.json()) as PlaceDetailsResponse;
    const location = data.result?.geometry?.location;
    const address = data.result?.formatted_address;

    if (data.status !== "OK" || !location || !address) return null;

    return {
      address,
      coords: { latitude: location.lat, longitude: location.lng },
    };
  } catch {
    return null;
  }
}
