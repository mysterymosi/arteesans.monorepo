import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { useSaveCustomerDefaultAddress } from "@/features/customer";
import { getCurrentCoordinates } from "@/features/service-requests";
import {
  fetchPlaceDetails,
  fetchPlacePredictions,
  type PlacePrediction,
} from "@/features/service-requests/lib/places";
import type { Coordinates } from "@/lib/geo";
import { geocodeAddress, reverseGeocodeAddress } from "@/lib/geocoding";
import { colors } from "@/theme";

type SelectedAddress = {
  displayAddress: string;
  line1: string;
  cityLga: string | null;
  state: string | null;
  coords: Coordinates | null;
};

function splitPrediction(description: string) {
  const [title, ...rest] = description.split(",");
  return {
    title: title?.trim() || description,
    subtitle: rest.join(",").trim(),
  };
}

function fallbackLine1(address: string) {
  return address.split(",")[0]?.trim() || address.trim();
}

async function resolveAddress(
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

export default function CustomerAddressScreen() {
  const saveAddress = useSaveCustomerDefaultAddress();
  const resetSaveAddress = saveAddress.reset;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchGenerationRef = useRef(0);

  function clearDebounceTimer() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }

  function invalidatePendingSearch() {
    clearDebounceTimer();
    searchGenerationRef.current += 1;
  }
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<SelectedAddress | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        invalidatePendingSearch();

        setQuery("");
        setPredictions([]);
        setSelectedAddress(null);
        setIsSearching(false);
        setIsResolving(false);
        setIsLocating(false);
        setError(null);
        resetSaveAddress();
      };
    }, [resetSaveAddress]),
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelectedAddress(null);
    setError(null);

    clearDebounceTimer();

    if (value.trim().length < 3) {
      searchGenerationRef.current += 1;
      setPredictions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      const generation = ++searchGenerationRef.current;
      void (async () => {
        const results = await fetchPlacePredictions(value);
        if (generation !== searchGenerationRef.current) return;
        setPredictions(results);
        setIsSearching(false);
      })();
    }, 300);
  }

  async function handleSelectPrediction(prediction: PlacePrediction) {
    invalidatePendingSearch();
    setIsResolving(true);
    setError(null);
    setPredictions([]);
    setQuery(prediction.description);

    const details = await fetchPlaceDetails(prediction.placeId);
    const resolved = details
      ? await resolveAddress(details.address, details.coords)
      : await resolveAddress(prediction.description);

    if (!resolved) {
      setError("Could not load that address. Try another result.");
    } else {
      setSelectedAddress(resolved);
      setQuery(resolved.displayAddress);
    }

    setIsResolving(false);
  }

  async function handleUseCurrentLocation() {
    invalidatePendingSearch();
    setIsLocating(true);
    setError(null);
    setPredictions([]);

    const { coords, error: locationError } = await getCurrentCoordinates();
    const address = await reverseGeocodeAddress(coords);
    const resolved = (address ? await resolveAddress(address, coords) : null) ?? {
      displayAddress: "Current location",
      line1: "Current location",
      cityLga: null,
      state: null,
      coords,
    };

    setSelectedAddress(resolved);
    setQuery(resolved.displayAddress);
    setError(locationError ?? null);
    setIsLocating(false);
  }

  async function handleConfirmAddress() {
    setError(null);

    const resolved = selectedAddress ?? (await resolveAddress(query));
    if (!resolved) {
      setError("Enter an address or use your current location.");
      return;
    }

    try {
      await saveAddress.mutateAsync({
        line1: resolved.line1,
        cityLga: resolved.cityLga,
        state: resolved.state,
        coords: resolved.coords,
      });
      router.back();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save address.",
      );
    }
  }

  const canConfirm = useMemo(
    () =>
      Boolean(selectedAddress || query.trim().length >= 3) &&
      !isResolving &&
      !isLocating &&
      !saveAddress.isPending,
    [isLocating, isResolving, query, saveAddress.isPending, selectedAddress],
  );
  const showEmptyPrompt =
    predictions.length === 0 &&
    query.trim().length < 3 &&
    !isResolving &&
    !isLocating;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1">
          <View className="px-6 pt-4">
            <View className="h-9 flex-row items-center justify-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close address screen"
                onPress={() => router.back()}
                className="absolute left-0 size-9 items-center justify-center active:opacity-70"
              >
                <Image
                  source={icons.xMark}
                  style={{ width: 18, height: 18 }}
                  contentFit="contain"
                />
              </Pressable>
              <Text className="font-semibold text-xl text-primary">
                Enter Address
              </Text>
            </View>

            <View className="mt-5 flex-row items-center rounded-xl border-2 border-primary bg-surface px-4">
              <Image
                source={icons.location}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
              <TextInput
                value={query}
                onChangeText={handleQueryChange}
                placeholder="Search for your address"
                placeholderTextColor={colors.textPlaceholder}
                autoCapitalize="words"
                autoCorrect={false}
                className="h-14 flex-1 px-3 font-sans text-base text-ink"
                style={{ includeFontPadding: false }}
              />
              {query.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear address search"
                  onPress={() => {
                    invalidatePendingSearch();
                    setQuery("");
                    setPredictions([]);
                    setSelectedAddress(null);
                    setError(null);
                    setIsSearching(false);
                  }}
                  className="size-7 items-center justify-center rounded-full bg-ink-secondary/20"
                >
                  <Image
                    source={icons.xMark}
                    style={{ width: 10, height: 10 }}
                    contentFit="contain"
                  />
                </Pressable>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => void handleUseCurrentLocation()}
              disabled={isLocating}
              className="mt-4 flex-row items-center gap-3 rounded-xl bg-primary-muted px-4 py-4 active:opacity-80"
            >
              {isLocating ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Image
                  source={icons.location}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              )}
              <Text className="font-semibold text-sm text-primary">
                {isLocating
                  ? "Getting your location..."
                  : "Use my current location"}
              </Text>
            </Pressable>

            {error ? (
              <Text className="mt-3 text-sm text-danger">{error}</Text>
            ) : null}
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow px-6 pb-6 pt-6"
            showsVerticalScrollIndicator={false}
          >
            {isSearching ? (
              <View className="mt-8 items-center">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null}

            {predictions.length > 0 ? (
              <View className="rounded-2xl bg-surface shadow-sm">
                {predictions.map((prediction) => {
                  const display = splitPrediction(prediction.description);
                  return (
                    <Pressable
                      key={prediction.placeId}
                      onPress={() => void handleSelectPrediction(prediction)}
                      className="flex-row gap-4 px-4 py-4 active:bg-surface-muted"
                    >
                      <View className="size-10 items-center justify-center rounded-full bg-surface-muted">
                        <Image
                          source={icons.location}
                          style={{ width: 18, height: 18 }}
                          contentFit="contain"
                        />
                      </View>
                      <View className="min-w-0 flex-1">
                        <Text className="font-semibold text-base text-ink">
                          {display.title}
                        </Text>
                        {display.subtitle ? (
                          <Text
                            className="mt-1 text-sm text-ink-secondary"
                            numberOfLines={2}
                          >
                            {display.subtitle}
                          </Text>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {showEmptyPrompt ? (
              <View className="flex-1 items-center justify-center pt-20">
                <Image
                  source={icons.searchOutlined}
                  style={{ width: 56, height: 56, opacity: 0.4 }}
                  contentFit="contain"
                />
                <Text className="mt-5 text-center text-base text-ink-secondary">
                  Start typing to search for an address
                </Text>
              </View>
            ) : null}
          </ScrollView>

          <View className="border-t border-line bg-surface px-6 py-4">
            <Button
              title="Confirm Address"
              flat
              disabled={!canConfirm}
              loading={saveAddress.isPending}
              onPress={() => void handleConfirmAddress()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
