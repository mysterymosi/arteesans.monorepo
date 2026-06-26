import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { supabase } from "@/lib/supabase";

export const MAX_IMAGE_BYTES = 500 * 1024;
export const MAX_REQUEST_PHOTOS = 5;
export const MAX_COMPLETION_PHOTOS = 3;

const MEDIA_BUCKETS = {
  request: "request-media",
  completion: "completion-media",
} as const;

function contentTypeForUri(uri: string): string {
  const extension = uri.split(".").pop()?.toLowerCase();
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "heic" || extension === "heif") return "image/heic";
  return "image/jpeg";
}

function extensionForContentType(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/heic") return "heic";
  return "jpg";
}

type PickPhotosOptions = {
  maxPhotos: number;
  existingCount?: number;
  selectionLimit?: number;
};

type PickPhotosResult = {
  uris: string[];
  error?: string;
};

export async function pickPhotos({
  maxPhotos,
  existingCount = 0,
  selectionLimit,
}: PickPhotosOptions): Promise<PickPhotosResult> {
  const remaining = maxPhotos - existingCount;
  const limit = Math.min(selectionLimit ?? remaining, remaining);

  if (limit <= 0) {
    return { uris: [], error: `You can add up to ${maxPhotos} photos.` };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: limit,
    quality: 0.8,
  });

  if (result.canceled) {
    return { uris: [] };
  }

  const uris: string[] = [];
  for (const asset of result.assets) {
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
      return { uris: [], error: "Each photo must be 500KB or less." };
    }
    uris.push(asset.uri);
  }

  return { uris };
}

type UploadPhotosOptions = {
  bucket: string;
  uris: string[];
  buildPath: (index: number, extension: string) => string;
};

export async function uploadPhotos({
  bucket,
  uris,
  buildPath,
}: UploadPhotosOptions): Promise<string[]> {
  const paths: string[] = [];

  for (const [index, uri] of uris.entries()) {
    const file = new File(uri);
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Each photo must be 500KB or less.");
    }

    const contentType = contentTypeForUri(uri);
    const extension = extensionForContentType(contentType);
    const path = buildPath(index, extension);
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: false,
    });

    if (error) {
      throw error;
    }

    paths.push(path);
  }

  return paths;
}

export async function pickRequestPhotos(options?: {
  selectionLimit?: number;
}): Promise<PickPhotosResult> {
  return pickPhotos({
    maxPhotos: MAX_REQUEST_PHOTOS,
    selectionLimit: options?.selectionLimit,
  });
}

export async function uploadRequestPhotos(userId: string, uris: string[]): Promise<string[]> {
  return uploadPhotos({
    bucket: MEDIA_BUCKETS.request,
    uris,
    buildPath: (index, extension) => `${userId}/${Date.now()}-${index}.${extension}`,
  });
}

export async function pickCompletionPhotos(existingCount: number): Promise<PickPhotosResult> {
  return pickPhotos({
    maxPhotos: MAX_COMPLETION_PHOTOS,
    existingCount,
  });
}

export async function uploadCompletionPhotos(
  artisanUserId: string,
  requestId: string,
  uris: string[],
): Promise<string[]> {
  return uploadPhotos({
    bucket: MEDIA_BUCKETS.completion,
    uris,
    buildPath: (index, extension) =>
      `${artisanUserId}/${requestId}/${Date.now()}-${index}.${extension}`,
  });
}
