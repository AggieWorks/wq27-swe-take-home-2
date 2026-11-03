"use server";

// import { fetchExternalImage } from "next/dist/server/image-optimizer";
import { cookies } from "next/headers";
import { z } from "zod";

import { appEnv } from "@/lib/env";
import { DealInsert, dealSchema, likeSchema } from "@/types/types";

export const getAllDeals = async (search?: string) => {
  console.log("Getting deals...");

  // Call API route to get all deals
  const response = await fetch(
    `${appEnv.BASE_API_URL}/api/deal${search ? `?search=${search}` : ""}`
  );
  const dealsData = await response.json();

  // Validate response data as an array of deals
  const parsed = dealSchema.array().safeParse(dealsData);

  if (!parsed.success) {
    console.error("Invalid response for deals:", parsed.error);
    return [];
  }

  // Response data is valid, return it
  console.log("Successfully retrieved deals:", parsed.data);
  return parsed.data;
};

export const getDealById = async (id: string) => {
  console.log("Getting deal by ID:", id);

  // Call API route to get deal by ID
  const response = await fetch(`${appEnv.BASE_API_URL}/api/deal/${id}`);
  const dealData = await response.json();

  // Validate response data as a deal
  const parsed = dealSchema.safeParse(dealData);

  if (!parsed.success) {
    console.error("Invalid response for deal:", parsed.error);
    return null;
  }

  // Response data is valid, return it
  console.log("Successfully retrieved deal:", parsed.data);
  return parsed.data;
};

export const getDealsByUser = async (userId: string) => {
  console.log("Getting deals from user:", userId);

  // Call API route to get deal by ID
  const response = await fetch(
    `${appEnv.BASE_API_URL}/api/deal/user/${userId}`
  );
  const dealsData = await response.json();

  if (dealsData["error"] != null) {
    // No deals
    return [];
  }

  // Validate response data as an array of deals
  const parsed = dealSchema.array().safeParse(dealsData);

  if (!parsed.success) {
    console.error("Invalid response for deals:", parsed.error);
    return [];
  }

  // Response data is valid, return it
  console.log("Successfully retrieved deals:", parsed.data);
  return parsed.data;
};

export const createDeal = async (
  deal: DealInsert & { businessName?: string }
) => {
  console.log("Creating deal:", deal);
  const cookie = (await cookies()).get("session")?.value;

  let businessId = deal.businessId;

  // temporary id for new business
  if (
    businessId === "000-0000-0000-0000-0000-0000-0000-0000" &&
    deal.businessName
  ) {
    console.log("Creating new business with name:", deal.businessName);

    const newBusiness = {
      name: deal.businessName,
    };

    // make new business
    const createBusinessResponse = await fetch(
      `${appEnv.BASE_API_URL}/api/business`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBusiness),
      }
    );

    if (!createBusinessResponse.ok) {
      console.error(
        "Failed to create business:",
        createBusinessResponse.statusText
      );
      return null;
    }

    const business = await createBusinessResponse.json();
    businessId = business.id;
  }

  // Create a new deal object with the businessId (either provided or newly created)
  const dealWithBusinessId = {
    ...deal,
    businessId: businessId,
  };

  // Remove any extra fields not in the DealInsert type
  delete dealWithBusinessId.businessName;

  // Now create the deal with the businessId
  const response = await fetch(`${appEnv.BASE_API_URL}/api/deal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookie}`,
    },
    body: JSON.stringify(dealWithBusinessId),
    credentials: "include", // Try adding this to ensure cookies are sent
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create deal:", response.status, errorText);
    return null;
  }

  const dealData = await response.json();

  // Validate response data as a deal
  const parsed = dealSchema.safeParse(dealData);

  if (!parsed.success) {
    console.error("Invalid response for deal:", parsed.error);
    return null;
  }

  // Response data is valid, return it
  console.log("Successfully created deal:", parsed.data);
  return parsed.data;
};

export const getDealLikeInfo = async (dealId: string) => {
  const cookie = (await cookies()).get("session")?.value;
  const response = await fetch(
    `${appEnv.BASE_API_URL}/api/deal/like/${dealId}`,
    {
      method: "GET",
      headers: {
        Cookie: `session=${cookie}`,
      },
    }
  );
  const likeData = await response.json();

  // Validate response data as a like
  const parsed = z
    .object({
      numLikes: z.number(),
      liked: z.boolean(),
    })
    .safeParse(likeData);

  if (!parsed.success) {
    console.error("Invalid response for like:", parsed.error);
    return null;
  }

  // Response data is valid, return it
  console.log("Successfully retrieved like info:", parsed.data);
  return parsed.data;
};

export const likeDeal = async (dealId: string) => {
  const cookie = (await cookies()).get("session")?.value;
  const response = await fetch(
    `${appEnv.BASE_API_URL}/api/deal/like/${dealId}`,
    {
      method: "POST",
      headers: {
        Cookie: `session=${cookie}`,
      },
    }
  );
  const likeData = await response.json();

  // Validate response data as a like
  const parsed = likeSchema.safeParse(likeData);

  if (!parsed.success) {
    console.error("Invalid response for like:", parsed.error);
    return null;
  }

  // Response data is valid, return it
  console.log("Successfully liked deal:", parsed.data);
  return parsed.data;
};

export const unlikeDeal = async (dealId: string) => {
  const cookie = (await cookies()).get("session")?.value;
  const response = await fetch(
    `${appEnv.BASE_API_URL}/api/deal/like/${dealId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `session=${cookie}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to unlike deal:", response.statusText);
    return;
  }

  // Response data is valid, return it
  console.log("Successfully unliked deal:", dealId);
  return;
};

export const updateDeal = async (dealId: string, updatedDeal: DealInsert) => {
  const cookie = (await cookies()).get("session")?.value;

  // Call API route to update a deal
  const response = await fetch(`${appEnv.BASE_API_URL}/api/deal/${dealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookie}`,
    },
    body: JSON.stringify(updatedDeal),
  });

  if (!response.ok) {
    console.error("Failed to update deal:", response.statusText);
    return;
  }

  const dealData = await response.json();

  // Validate response data as a deal
  const parsed = dealSchema.safeParse(dealData);
  if (!parsed.success) {
    console.error("Invalid response for deal:", parsed.error);
    return null;
  }

  // Response data is valid, return it
  console.log("Successfully updated deal:", parsed.data);
  return parsed.data;
};

export const deleteDeal = async (dealId: string) => {
  const cookie = (await cookies()).get("session")?.value;

  // Call API route to delete a deal
  const response = await fetch(`${appEnv.BASE_API_URL}/api/deal/${dealId}`, {
    method: "DELETE",
    headers: {
      Cookie: `session=${cookie}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to delete deal:", response.statusText);
    return;
  }

  // Response data is valid, return it
  console.log("Successfully deleted deal:", dealId);
  return;
};
