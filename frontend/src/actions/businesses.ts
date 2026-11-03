"use server";

import { z } from "zod";

import { appEnv } from "@/lib/env";

const businessSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuisineType: z.string(),
});

const businessesSchema = z.array(businessSchema);

export type Business = z.infer<typeof businessSchema>;

export const getAllBusinesses = async (): Promise<Business[]> => {
  try {
    const apiUrl = `${appEnv.BASE_API_URL}/api/business`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Failed to fetch businesses. Status: ${response.status}`);
      throw new Error(`Failed to fetch businesses: ${response.statusText}`);
    }

    const businessesData = await response.json();

    const parsed = businessesSchema.safeParse(businessesData);

    if (!parsed.success) {
      console.error(
        "Invalid data structure received for businesses:",
        parsed.error.flatten()
      );
      return [];
    }
    return parsed.data;
  } catch (error) {
    console.error("Error in getAllBusinesses action:", error);
    return [];
  }
};
