import { Image } from "expo-image";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import {
  MAX_REQUEST_PHOTOS,
  pickRequestPhotos,
} from "@/features/service-requests/services/request-media.service";

type RequestPhotoPickerProps = {
  photoUris: string[];
  onChange: (uris: string[]) => void;
  onError?: (message: string) => void;
  error?: string;
};

const THUMB_SIZE = 96;

function UploadPrompt() {
  return (
    <>
      <Image source={icons.upload} style={{ width: 24, height: 24 }} contentFit="contain" />
      <Text className="mt-3 text-center text-sm text-ink-secondary">
        Tap to upload the photos of the issue
      </Text>
      <Text className="mt-1 text-center text-sm text-ink-muted">(not more than 500kb)</Text>
    </>
  );
}

export function RequestPhotoPicker({
  photoUris,
  onChange,
  onError,
  error,
}: RequestPhotoPickerProps) {
  const canAddMore = photoUris.length < MAX_REQUEST_PHOTOS;

  async function handlePickPhotos() {
    if (!canAddMore) {
      onError?.("You can add up to 5 photos.");
      return;
    }

    const remaining = MAX_REQUEST_PHOTOS - photoUris.length;
    const { uris, error: pickError } = await pickRequestPhotos({ selectionLimit: remaining });

    if (pickError) {
      onError?.(pickError);
      return;
    }

    if (uris.length === 0) return;

    onChange([...photoUris, ...uris]);
  }

  function handleRemove(uri: string) {
    onChange(photoUris.filter((item) => item !== uri));
  }

  const hasPhotos = photoUris.length > 0;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-medium text-sm text-ink">Add Photos (Optional)</Text>
        {hasPhotos ? (
          <Text className="text-xs text-ink-muted">
            {photoUris.length}/{MAX_REQUEST_PHOTOS} selected
          </Text>
        ) : null}
      </View>

      {hasPhotos ? (
        <View className="gap-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3"
          >
            {photoUris.map((uri) => (
              <View key={uri} className="relative" style={{ width: THUMB_SIZE, height: THUMB_SIZE }}>
                <Image
                  source={{ uri }}
                  style={{ width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 16 }}
                  contentFit="cover"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove photo"
                  onPress={() => handleRemove(uri)}
                  className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-danger"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3,
                  }}
                >
                  <Text className="text-base font-bold leading-none text-white">×</Text>
                </Pressable>
              </View>
            ))}

            {canAddMore ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add more photos"
                onPress={() => void handlePickPhotos()}
                className="items-center justify-center rounded-2xl border border-dashed border-ink-secondary/35 bg-surface"
                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
              >
                <Image source={icons.plus} style={{ width: 18, height: 18 }} contentFit="contain" />
                <Text className="mt-1 text-xs text-ink-secondary">Add more</Text>
              </Pressable>
            ) : null}
          </ScrollView>

          <Text className="text-xs text-ink-muted">Tap × to remove a photo before submitting.</Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Upload photos"
          onPress={() => void handlePickPhotos()}
          className="items-center justify-center rounded-2xl border border-dashed border-ink-secondary/35 bg-surface px-4 py-10"
        >
          <UploadPrompt />
        </Pressable>
      )}

      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
