import { createServiceClient } from "./server";

export async function createSignedUrls(bucket: string, paths: string[]) {
  if (paths.length === 0) {
    return [];
  }

  const service = createServiceClient();
  const { data, error } = await service.storage
    .from(bucket)
    .createSignedUrls(paths, 3600);

  if (error || !data) {
    return [];
  }

  return data.map((item) => item.signedUrl).filter(Boolean) as string[];
}
