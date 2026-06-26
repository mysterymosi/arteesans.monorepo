import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import { Button, ScreenHeader, Text } from "@/components/ui";
import {
  MAX_COMPLETION_PHOTOS,
  pickCompletionPhotos,
  uploadCompletionPhotos,
  useArtisanJob,
  useAttachCompletionMedia,
  useUpdateJobStatus,
} from "@/features/artisan-jobs";
import { useAuthSession } from "@/providers/auth-provider";
import { routes } from "@/lib/routes";

export default function ArtisanJobCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuthSession();
  const { data: job } = useArtisanJob(id);
  const updateStatus = useUpdateJobStatus();
  const attachMedia = useAttachCompletionMedia();
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const existingCount =
    (job?.completion_media_paths?.length ?? 0) + photoUris.length;

  const handlePickPhotos = async () => {
    const result = await pickCompletionPhotos(existingCount);
    if (result.error) {
      Alert.alert("Photos", result.error);
      return;
    }
    if (result.uris.length > 0) {
      setPhotoUris((current) => [...current, ...result.uris]);
    }
  };

  const handleComplete = async () => {
    if (!job || !session?.user.id) return;

    setIsUploading(true);
    try {
      if (job.status === "in_progress") {
        await updateStatus.mutateAsync({ requestId: job.id, status: "completed" });
      }

      if (photoUris.length > 0) {
        const paths = await uploadCompletionPhotos(session.user.id, job.id, photoUris);
        await attachMedia.mutateAsync({ requestId: job.id, paths });
      }

      router.replace(routes.artisan.home);
    } catch (error) {
      Alert.alert(
        "Could not complete job",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || updateStatus.isPending || attachMedia.isPending;

  return (
    <View className="flex-1 bg-surface">
      <ScreenHeader title="Complete job" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-5 px-5 pb-10"
      >
        <Text className="text-sm text-ink-secondary">
          Optionally add up to {MAX_COMPLETION_PHOTOS} completion photos, then mark the job
          complete.
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {photoUris.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={{ width: 88, height: 88, borderRadius: 12 }}
              contentFit="cover"
            />
          ))}
        </View>

        {existingCount < MAX_COMPLETION_PHOTOS ? (
          <Button title="Add photos" variant="outline" onPress={handlePickPhotos} />
        ) : null}

        <Button
          title="Mark job complete"
          loading={isBusy}
          onPress={handleComplete}
        />
      </ScrollView>
    </View>
  );
}
