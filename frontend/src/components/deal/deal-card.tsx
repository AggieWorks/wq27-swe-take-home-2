"use client";

import { useAtom } from "jotai";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDealLikeInfo, {
  useUpdateDealLikeInfo,
} from "@/hooks/queries/deal-likes";
import { useUser } from "@/hooks/queries/user";
import { captureAnalytics } from "@/lib/analytics";
import { isLoginModalOpenAtom } from "@/lib/atoms";
import { resolvePublicImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import { Deal } from "@/types/types";

import ExclusiveBadge from "./exclusive-badge";
import SkeletonCard from "./skeleton-card";
export default function DealsCard({
  deal,
  showBorder,
  isExpiringSoon,
  isFirst,
  isInCarousel,
}: {
  deal: Deal;
  showBorder?: boolean;
  isExpiringSoon?: boolean;
  isFirst?: boolean;
  isInCarousel?: boolean;
}) {
  const router = useRouter();
  const {
    data: dealLikeInfo,
    isPending: isDealLikeInfoPending,
    error: dealLikeInfoError,
  } = useDealLikeInfo(deal.id);
  const { data: user } = useUser();
  const { mutate } = useUpdateDealLikeInfo(deal.id);
  const [, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleCardClick = () => {
    captureAnalytics(`deal_card_clicked`, {
      dealId: deal.id,
      dealName: deal.name,
    });
    router.push(`/deals/${deal.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dealLikeInfo) return;
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    captureAnalytics("deal_like_clicked", {
      dealId: deal.id,
      dealName: deal.name,
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

  return (
    <div className="relative">
      <div
        className={cn(
          "relative w-full min-w-[200px] cursor-pointer select-none sm:min-h-[18rem]",
          "sm:w-full", // Ensures each card takes the full width of its grid column
          showBorder &&
            "border-1 border-b border-[#d8d8d8] sm:border-0 sm:pb-0",
          isInCarousel
            ? "h-[20.5rem]"
            : "flex items-center gap-[0.875rem] py-5 sm:block",
          loading && "invisible"
        )}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "relative size-[5.125rem] min-w-[5.125rem] sm:h-[11.75rem] sm:w-full",
            isInCarousel && "h-[11.75rem] w-full"
          )}
        >
          {deal.isExclusive && <ExclusiveBadge />}
          <Image
            src={resolvePublicImageUrl(deal.business?.image)}
            alt={`Image for the deal, '${deal.name}'`}
            className="h-full w-full rounded-lg object-cover"
            fill
            sizes="50vw"
          />
          <div className="absolute left-0 top-0 h-full w-full rounded-lg shadow-[inset_0px_35px_23.9px_0px_rgba(0,0,0,0.32)]"></div>
        </div>
        <div
          className={cn(
            "relative flex w-full max-w-screen-xs flex-col",
            isInCarousel ? "gap-1" : "gap-0 sm:gap-1"
          )}
        >
          <div className="flex items-center">
            <div className={cn("mt-1 flex min-h-[2.5rem] w-full items-center")}>
              {deal.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image
                        src="verify-vector.svg"
                        alt="Verified checkmark"
                        width={24}
                        height={24}
                        className="mb-1 mr-1.5 inline-block align-middle"
                      />
                    </TooltipTrigger>
                    <TooltipContent side={isFirst ? "right" : "top"}>
                      This deal has been verified by Dibs
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <span
                className={cn(
                  "inline-block text-[0.75rem] font-semibold text-text-dark",
                  isHovered && "text-secondary underline",
                  isInCarousel ? "line-clamp-2" : "line-clamp-1"
                )}
              >
                {deal.name}
              </span>
            </div>
          </div>
          <p className="font line-clamp-1 text-[0.75rem] font-medium text-text-dark">
            {deal.business.name}
          </p>
          {isExpiringSoon && deal.expiresOn ? (
            <div className="flex items-center gap-1">
              <p className="font line-clamp-1 text-[0.75rem] text-warning">
                Expires:{" "}
                {`${deal.expiresOn.getUTCMonth() + 1}-${deal.expiresOn.getUTCDate()}`}
                -{deal.expiresOn.getUTCFullYear()}
              </p>
              <Image
                src="hourglass.svg"
                alt="hourglass emoji"
                className="h-auto w-auto"
                width={24}
                height={24}
              />
            </div>
          ) : (
            <>
              <p className="line-clamp-1 text-[0.75rem] text-text-dark">
                Posted on:{" "}
                {`${deal.createdAt.getUTCMonth() + 1}-${deal.createdAt.getUTCDate()}`}
                -{deal.createdAt.getUTCFullYear()}
              </p>
            </>
          )}
          <div className="mt-1 flex items-center gap-1.5">
            <Heart
              strokeWidth={1}
              fill={cn(dealLikeInfo.liked ? "#FF5959" : "white")}
              opacity={dealLikeInfo.liked ? 1 : 0.5}
              onClick={handleLikeClick}
              className="transition hover:scale-105"
            />
            <p className="inline-block text-[0.75rem] font-medium text-text-dark">
              {dealLikeInfo.numLikes}
            </p>
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0">
          <SkeletonCard isInCarousel={isInCarousel} />
        </div>
      )}
    </div>
  );
}
