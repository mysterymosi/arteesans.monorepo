import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { supabase } from "@/lib/supabase";

const MAX_BYTES = 500 * 1024;
export const MAX_REQUEST_PHOTOS = 5;

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

export async function pickRequestPhotos(options?: {
  selectionLimit?: number;
}): Promise<{
  uris: string[];
  error?: string;
}> {
  const selectionLimit = Math.min(
    options?.selectionLimit ?? MAX_REQUEST_PHOTOS,
    MAX_REQUEST_PHOTOS,
  );

  if (selectionLimit <= 0) {
    return { uris: [], error: "You can add up to 5 photos." };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit,
    quality: 0.8,
  });

  if (result.canceled) {
    return { uris: [] };
  }

  const uris: string[] = [];
  for (const asset of result.assets) {
    if (asset.fileSize && asset.fileSize > MAX_BYTES) {
      return { uris: [], error: "Each photo must be 500KB or less." };
    }
    uris.push(asset.uri);
  }

  return { uris };
}

export async function uploadRequestPhotos(
  userId: string,
  uris: string[],
): Promise<string[]> {
  const paths: string[] = [];

  for (const [index, uri] of uris.entries()) {
    const file = new File(uri);
    if (file.size > MAX_BYTES) {
      throw new Error("Each photo must be 500KB or less.");
    }

    const contentType = contentTypeForUri(uri);
    const extension = extensionForContentType(contentType);
    const path = `${userId}/${Date.now()}-${index}.${extension}`;
    const { error } = await supabase.storage
      .from("request-media")
      .upload(path, file, {
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
