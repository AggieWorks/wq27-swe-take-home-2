import { z } from "zod";

const optionalNonEmptyString = z
  .string()
  .optional()
  .transform((value) => value?.trim() ?? "");

export const zEnv = z.object({
  POSTHOG_KEY: optionalNonEmptyString,
  POSTHOG_HOST: z
    .union([z.string().url("POSTHOG_HOST must be a valid URL"), z.literal("")])
    .optional()
    .transform((value) => value?.trim() ?? ""),
  BASE_API_URL: z
    .string()
    .url("BASE_API_URL must be a valid URL")
    .nonempty("BASE_API_URL is required"),
  GOOGLE_MAPS_API_KEY: optionalNonEmptyString,
});

const parsed = zEnv.parse({
  POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
});

export const appEnv = {
  ...parsed,
  isPostHogEnabled: parsed.POSTHOG_KEY.length > 0,
  isGoogleMapsEnabled: parsed.GOOGLE_MAPS_API_KEY.length > 0,
};
