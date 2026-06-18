import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { supabase } from "@/lib/supabase";

const MAX_BYTES = 2000 * 1024;

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

function fileNameFromUri(uri: string): string {
  const segment = uri.split("/").pop();
  return segment && segment.length > 0 ? segment : "document.jpg";
}

export async function pickVerificationDocument(): Promise<{
  uri?: string;
  fileName?: string;
  error?: string;
}> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: false,
    quality: 0.8,
  });

  if (result.canceled || result.assets.length === 0) {
    return {};
  }

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_BYTES) {
    return { error: "File must be 500KB or less." };
  }

  const file = new File(asset.uri);
  if (file.size > MAX_BYTES) {
    return { error: "File must be 500KB or less." };
  }

  return { uri: asset.uri, fileName: fileNameFromUri(asset.uri) };
}

export async function uploadVerificationDocument(
  userId: string,
  docType: string,
  uri: string,
): Promise<string> {
  const file = new File(uri);
  if (file.size > MAX_BYTES) {
    throw new Error("File must be 500KB or less.");
  }

  const contentType = contentTypeForUri(uri);
  const extension = extensionForContentType(contentType);
  const path = `${userId}/${docType}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("verification-docs")
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (error) throw error;
  return path;
}
