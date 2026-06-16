import * as Location from "expo-location";
import type { Coordinates } from "@/lib/geo";

export type { Coordinates };

const LAGOS_FALLBACK: Coordinates = { latitude: 6.5244, longitude: 3.3792 };

export async function getCurrentCoordinates(): Promise<{ coords: Coordinates; error?: string }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return { coords: LAGOS_FALLBACK, error: "Location permission denied. Using Lagos as default." };
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
  };
}

export async function reverseGeocodeCity(coords: Coordinates): Promise<string | null> {
  const results = await Location.reverseGeocodeAsync(coords);
  const place = results[0];
  if (!place) return null;
  return place.city ?? place.subregion ?? place.region ?? null;
}
