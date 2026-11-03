"use client";

import { useAtom } from "jotai";
import { Heart } from "lucide-react";

import useDealLikeInfo, {
  useUpdateDealLikeInfo,
} from "@/hooks/queries/deal-likes";
import { useUser } from "@/hooks/queries/user";
import { captureAnalytics } from "@/lib/analytics";
import { isLoginModalOpenAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";

export default function DealLikes({
  dealId,
  dealName,
}: {
  dealId: string;
  dealName: string;
}) {
  const {
    data: dealLikeInfo,
    isPending: isDealLikeInfoPending,
    error: dealLikeInfoError,
  } = useDealLikeInfo(dealId);
  const { data: user } = useUser();
  const { mutate } = useUpdateDealLikeInfo(dealId);
  const [, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);

  const handleLikeClick = () => {
    if (!dealLikeInfo) return;
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    captureAnalytics("deal_like_clicked", {
      dealId: dealId,
      dealName: dealName,
      action: dealLikeInfo.liked ? "unlike" : "like",
    });
    mutate(dealLikeInfo.liked);
  };

  if (isDealLikeInfoPending) {
    return <></>;
  }

  if (dealLikeInfoError) {
    console.error(
      "Failed to retrieve deal like info or user:",
      dealLikeInfoError
    );
    return <></>;
  }

  if (isDealLikeInfoPending) {
    return <div>Loading...</div>;
  }

  if (dealLikeInfoError) {
    return <div>Error fetching deal like info</div>;
  }

  return (
    <div
      className="flex w-min cursor-pointer items-center gap-1 rounded-full border border-black px-6 py-2 transition hover:scale-105"
      onClick={handleLikeClick}
    >
      {dealLikeInfo.numLikes}
      <Heart
        fill={cn(dealLikeInfo.liked ? "#FF5959" : "black")}
        strokeWidth={0}
        className={cn("opacity-50", dealLikeInfo.liked && "opacity-100")}
      />
    </div>
  );
}
