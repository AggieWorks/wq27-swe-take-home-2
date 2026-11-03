import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { appEnv } from "@/lib/env";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = ["image/jpeg", "image/png"];

/**
 * Requests a local upload URL from the API (take-home; no cloud storage).
 */
export async function getPresignedUrl(key: string) {
  const response = await fetch(`${appEnv.BASE_API_URL}/api/presigned-url`, {
    method: "POST",
    body: JSON.stringify({ key }),
  });
  const data = await response.json();

  const parsed = z
    .object({
      presignedUrl: z.string().url(),
      uploadedUrl: z.string().url(),
    })
    .safeParse(data);

  if (!parsed.success) {
    throw new Error("Failed to get presigned URL");
  }

  return parsed.data;
}

/**
 * Helper function to upload a file to a presigned URL
 * @param presignedUrl
 * @param file
 * @returns
 */
export async function uploadFile(presignedUrl: string, file: File) {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large");
  }

  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
}

/** Upload an image via the API local storage and return its public URL. */
export async function uploadImage(userId: string, file: File) {
  const key = `${userId}/${uuidv4()}`;
  const { presignedUrl, uploadedUrl } = await getPresignedUrl(key);
  await uploadFile(presignedUrl, file);
  return uploadedUrl;
}
