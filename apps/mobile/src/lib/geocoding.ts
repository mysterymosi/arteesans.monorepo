import * as Location from "expo-location";
import { env } from "@/lib/env";
import type { Coordinates } from "@/lib/geo";

const GOOGLE_MAPS_API_KEY = env.googleMapsApiKey;

type GoogleAddressComponent = {
  long_name: string;
  types: string[];
};

type GoogleGeocodeResponse = {
  status: string;
  results?: Array<{ formatted_address: string }>;
};

type GoogleGeocodeByAddressResponse = {
  status: string;
  results?: Array<{
    formatted_address: string;
    address_components: GoogleAddressComponent[];
    geometry: { location: { lat: number; lng: number } };
  }>;
};

export type GeocodedAddress = {
  coords: Coordinates;
  formattedAddress: string;
  line1: string;
  cityLga: string | null;
  state: string | null;
};

function componentValue(
  components: GoogleAddressComponent[],
  type: string,
): string | null {
  return (
    components.find((component) => component.types.includes(type))?.long_name ??
    null
  );
}

function parseGoogleAddress(
  components: GoogleAddressComponent[],
  formattedAddress: string,
): Pick<GeocodedAddress, "line1" | "cityLga" | "state"> {
  const streetLine = [
    componentValue(components, "street_number"),
    componentValue(components, "route"),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    line1:
      streetLine || formattedAddress.split(",")[0]?.trim() || formattedAddress,
    cityLga:
      componentValue(components, "locality") ??
      componentValue(components, "administrative_area_level_2"),
    state:
      componentValue(components, "administrative_area_level_1") ??
      componentValue(components, "administrative_area_level_2"),
  };
}

function parseExpoAddress(
  place: Location.LocationGeocodedAddress,
  fallbackLine1: string,
): Pick<GeocodedAddress, "line1" | "cityLga" | "state"> {
  const streetLine = [place.streetNumber, place.street, place.name]
    .filter(Boolean)
    .join(" ");

  return {
    line1: streetLine || fallbackLine1,
    cityLga: place.city ?? place.subregion ?? null,
    state: place.region ?? null,
  };
}

async function formatAddressWithExpo(
  coords: Coordinates,
): Promise<string | null> {
  const results = await Location.reverseGeocodeAsync(coords);
  const place = results[0];
  if (!place) return null;

  return [
    place.name,
    place.street,
    place.streetNumber,
    place.city,
    place.region,
  ]
    .filter(Boolean)
    .join(", ");
}

export async function reverseGeocodeAddress(
  coords: Coordinates,
): Promise<string | null> {
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const params = new URLSearchParams({
        latlng: `${coords.latitude},${coords.longitude}`,
        key: GOOGLE_MAPS_API_KEY,
      });
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params}`,
      );
      const data = (await response.json()) as GoogleGeocodeResponse;

      if (data.status === "OK" && data.results?.[0]?.formatted_address) {
        return data.results[0].formatted_address;
      }
    } catch {
      // Fall back to on-device reverse geocoding.
    }
  }

  return formatAddressWithExpo(coords);
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodedAddress | null> {
  const trimmed = address.trim();
  if (trimmed.length < 3) return null;

  if (GOOGLE_MAPS_API_KEY) {
    try {
      const params = new URLSearchParams({
        address: trimmed,
        key: GOOGLE_MAPS_API_KEY,
        components: "country:ng",
      });
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params}`,
      );
      const data = (await response.json()) as GoogleGeocodeByAddressResponse;

      const match = data.results?.[0];
      if (data.status === "OK" && match) {
        return {
          coords: {
            latitude: match.geometry.location.lat,
            longitude: match.geometry.location.lng,
          },
          formattedAddress: match.formatted_address,
          ...parseGoogleAddress(
            match.address_components,
            match.formatted_address,
          ),
        };
      }
    } catch {
      // Fall back to on-device geocoding.
    }
  }

  const results = await Location.geocodeAsync(trimmed);
  const match = results[0];
  if (!match?.latitude || !match?.longitude) return null;

  const coords = { latitude: match.latitude, longitude: match.longitude };
  const reversed = await Location.reverseGeocodeAsync(coords);
  const place = reversed[0];

  console.log({ reversed });

  return {
    coords,
    formattedAddress: trimmed,
    ...(place
      ? parseExpoAddress(place, trimmed)
      : { line1: trimmed, cityLga: null, state: null }),
  };
}
