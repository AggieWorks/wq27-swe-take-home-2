import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getDealLikeInfo, likeDeal, unlikeDeal } from "@/actions/deals";

/**
 * Fetches deal like info
 * @param dealId
 * @returns
 */
export default function useDealLikeInfo(dealId: string) {
  return useQuery({
    queryKey: ["deal-like-info", dealId],
    queryFn: async () => {
      const response = await getDealLikeInfo(dealId);
      if (!response) {
        throw new Error("Failed to retrieve deal like info");
      }
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Updates deal like info
 * @param dealId
 * @returns
 */
export function useUpdateDealLikeInfo(dealId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isCurrentlyLiked: boolean) => {
      if (isCurrentlyLiked) await unlikeDeal(dealId);
      else await likeDeal(dealId);
    },
    onError: (error) => {
      console.error("Failed to update deal like info:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deal-like-info", dealId] });
    },
  });
}
