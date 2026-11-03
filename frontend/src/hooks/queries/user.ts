import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/actions/user";
import { identifyAnalytics } from "@/lib/analytics";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getUser();

      if (!response) {
        // throw new Error("User not found");
        return null;
      }

      // Identify user with PostHog
      identifyAnalytics(response.id, {
        email: response.email,
        phone: response.phone,
        nickname: response.nickname,
        role: response.role,
      });

      return response;
    },
  });
}
