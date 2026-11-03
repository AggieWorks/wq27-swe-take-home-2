import { http, HttpResponse } from "msw";

import { appEnv } from "@/test/env";
import { Deal } from "@/types/types";

const mockBusiness = {
  id: "b23e4567-e89b-12d3-a456-426614174001",
  name: "Dibs Donuts",
  address: "1260 Lake Blvd #110, Davis, CA 95616",
  image: "",
  hours: null,
  cuisineType: "American",
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * These handlers are used to mock API responses for testing purposes.
 *
 * To add a new handler, follow these steps:
 * 1. Import the necessary modules from "msw" and other dependencies.
 * 2. Define the new handler using `http.get`, `http.post`, etc., depending on the HTTP method.
 * 3. Specify the URL pattern and the function that returns the mock response.
 * 4. Add the new handler to the `handlers` array.
 */
export const handlers = [
  http.get(`${appEnv.BASE_API_URL}/api/deal`, () => {
    return HttpResponse.json<Deal[]>([
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Bottomless mimosas and $5 off entrees",
        description: null,
        userId: "723e4567-e89b-12d3-a456-426614174000",
        businessId: mockBusiness.id,
        business: mockBusiness,
        redeemImage: "/deal_placeholder.svg",
        redeemInstructions: "Show this coupon at checkout",
        expiresOn: new Date("2024-12-31"),
        isVerified: true,
        isExclusive: false,
        recurrenceUnit: null,
        recurrenceDays: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "423e4567-e89b-12d3-a456-426614174000",
        name: "Another Special",
        description: "Free for a limited time!",
        userId: "723e4567-e89b-12d3-a456-426614174000",
        businessId: mockBusiness.id,
        business: mockBusiness,
        redeemImage: "/deal_placeholder.svg",
        redeemInstructions: null,
        expiresOn: new Date("2024-10-15"),
        isVerified: false,
        isExclusive: false,
        recurrenceUnit: null,
        recurrenceDays: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }),
];
