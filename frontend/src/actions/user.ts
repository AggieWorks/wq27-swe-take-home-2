"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { appEnv } from "@/lib/env";
import { userSchema, UserUpdate } from "@/types/types";

/**
 * Fetches the user data from the API and redirects to the home page if the user data is invalid.
 */
export const getUser = async (shouldRedirect = false) => {
  const cookie = (await cookies()).get("session")?.value;
  const response = await fetch(`${appEnv.BASE_API_URL}/api/user`, {
    headers: {
      Cookie: `session=${cookie}`,
    },
  });
  const data = await response.json();

  const parsed = userSchema.safeParse(data);
  
  if (!parsed.success) {
    if (shouldRedirect) redirect("/");
  }

  return parsed.data;
};

export const updateUser = async (user: UserUpdate) => {
  const cookie = (await cookies()).get("session")?.value;
  const response = await fetch(`${appEnv.BASE_API_URL}/api/user`, {
    method: "PUT",
    headers: {
      Cookie: `session=${cookie}`,
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();

  console.log(data);

  // Validate response data as user
  const parsed = userSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Invalid response for user:", parsed.error);
    return null;
  }

  // Response data is valid, return it
  console.log("Successfully updated user:", parsed.data);
  return parsed.data;
};
export const signout = async () => {
  const cookie = (await cookies()).get("session")?.value;
  await fetch(`${appEnv.BASE_API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: `session=${cookie}`,
    },
  });
  (await cookies()).delete("session");
  
  redirect('/');
};

export const subscribe = async (phoneNumber: string) => {
  // Simulate load time
  await new Promise((r) => setTimeout(r, 2000));

  const response = await fetch(`${appEnv.BASE_API_URL}/api/subscribe`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: phoneNumber }),
  });
  const data = await response.json();

  const parsed = userSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.errors.join(", "));
  }

  return parsed.data;
};

export const getUserById = async (userId: string) => {
  const cookie = (await cookies()).get("session")?.value;
  const response = await fetch(`${appEnv.BASE_API_URL}/api/user/${userId}`, {
    headers: {
      Cookie: `session=${cookie}`,
    },
  });
  const data = await response.json();
  const parsed = userSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Invalid response for user:", parsed.error);
    return null;
  }

  return parsed.data;
};
