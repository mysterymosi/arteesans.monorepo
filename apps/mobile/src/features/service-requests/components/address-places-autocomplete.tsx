import { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Text } from "@/components/ui";
import { reverseGeocodeAddress } from "@/lib/geocoding";
import { getCurrentCoordinates, type Coordinates } from "../lib/location";
import {
  fetchPlaceDetails,
  fetchPlacePredictions,
  type PlacePrediction,
} from "../lib/places";
import { colors } from "@/theme";

type AddressPlacesAutocompleteProps = {
  address: string;
  onAddressChange: (address: string) => void;
  onAddressBlur: () => void;
  onCoordinatesChange: (coords: Coordinates) => void;
  error?: string;
};

export const AddressPlacesAutocomplete = memo(function AddressPlacesAutocomplete({
  address,
  onAddressChange,
  onAddressBlur,
  onCoordinatesChange,
  error,
}: AddressPlacesAutocompleteProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [locationHint, setLocationHint] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function schedulePredictions(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setPredictions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      void (async () => {
        const results = await fetchPlacePredictions(query);
        setPredictions(results);
        setIsSearching(false);
      })();
    }, 300);
  }

  function handleChangeText(value: string) {
    onAddressChange(value);
    setLocationHint(null);
    schedulePredictions(value);
  }

  async function handleSelectPrediction(prediction: PlacePrediction) {
    setPredictions([]);
    setIsResolving(true);
    onAddressChange(prediction.description);

    const details = await fetchPlaceDetails(prediction.placeId);
    if (details) {
      onAddressChange(details.address);
      onCoordinatesChange(details.coords);
      setLocationHint("Address selected.");
    } else {
      setLocationHint("Could not load address details. Try another result.");
    }

    setIsResolving(false);
    onAddressBlur();
  }

  async function handleUseCurrentLocation() {
    setIsResolving(true);
    setPredictions([]);

    const { coords, error: locationError } = await getCurrentCoordinates();
    onCoordinatesChange(coords);

    const formattedAddress = await reverseGeocodeAddress(coords);
    if (formattedAddress) {
      onAddressChange(formattedAddress);
    }

    setLocationHint(locationError ?? "Current location captured.");
    setIsResolving(false);
    onAddressBlur();
  }

  const showPredictions = predictions.length > 0;

  return (
    <View className="gap-1.5">
      <Text className="font-medium text-sm text-ink">Your Address</Text>

      <View className="relative">
        <TextInput
          value={address}
          onChangeText={handleChangeText}
          onBlur={onAddressBlur}
          placeholder="Search for your address"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          autoCapitalize="words"
          className={`rounded-2xl border bg-surface px-4 py-3.5 pr-10 font-sans text-base text-ink ${error ? "border-danger" : "border-line-strong"}`}
        />

        {isSearching || isResolving ? (
          <View className="absolute bottom-0 right-3 top-0 justify-center">
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        ) : null}
      </View>

      {showPredictions ? (
        <View className="overflow-hidden rounded-2xl border border-line-strong bg-surface">
          {predictions.map((prediction, index) => (
            <Pressable
              key={prediction.placeId}
              onPressIn={() => void handleSelectPrediction(prediction)}
              className={`px-4 py-3 active:bg-surface-muted ${index < predictions.length - 1 ? "border-b border-line" : ""}`}
            >
              <Text className="text-sm text-ink">{prediction.description}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Pressable onPress={() => void handleUseCurrentLocation()} className="self-start">
        <Text className="text-sm text-primary">Use current GPS location</Text>
      </Pressable>

      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      {locationHint ? <Text className="text-xs text-ink-secondary">{locationHint}</Text> : null}
    </View>
  );
});
