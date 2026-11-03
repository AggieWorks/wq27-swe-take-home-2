import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getDealById } from "@/actions/deals";
import { getUserById } from "@/actions/user";
import DealLikes from "@/components/deal/deal-likes";
import ExclusiveBadge from "@/components/deal/exclusive-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { resolvePublicImageUrl } from "@/lib/image-url";

// import GoogleMap from "@/components/google-map";

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDealById(id);
  const user = deal ? await getUserById(deal.userId) : null;

  if (!deal) {
    return <div>Deal not found</div>;
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl sm:flex sm:justify-center sm:gap-16">
        <div className="w-full space-y-4">
          <Link
            className="ml-[-7px] flex items-center gap-2 text-sm font-semibold text-t-dark transition-colors hover:text-secondary sm:text-base"
            href="/"
          >
            <ChevronLeft
              size={22}
              opacity={0.8}
              color="#DE9337"
              className="relative top-[-2px]"
            />
            Back
          </Link>

          <div className="relative h-auto w-full">
            <Image
              src={resolvePublicImageUrl(deal.business.image)}
              alt="Restaurant image"
              className="h-auto w-full rounded-lg object-contain"
              width={100}
              height={100}
            />
            {deal.isExclusive && <ExclusiveBadge />}
          </div>
        </div>
        <div className="w-full flex-col space-y-3 pt-4">
          <div className="sm:space-y-4">
            <div className="space-y-1 sm:space-y-[0.625rem]">
              <h1 className="flex text-xs font-semibold text-t-dark sm:text-xl">
                {deal.isVerified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Image
                            src="/verify-vector.svg"
                            alt="Verified checkmark"
                            width={28}
                            height={28}
                            className="mr-2 align-middle"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>This deal has been verified by Dibs.</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <span>{deal.name}</span>
              </h1>
              <p className="text-xs text-t-dark">{deal.description}</p>
            </div>
            <div className="my-[0.625rem] h-px w-full bg-gray-300 sm:hidden"></div>
            <div className="space-y-1 sm:space-y-[0.625rem]">
              <div className="flex items-center gap-2">
                <p className="text-xs text-t-dark md:text-sm lg:text-base">
                  {deal.business.name}
                </p>
                {deal.expiresOn && (
                  <>
                    <div className="size-1.5 rounded-full bg-stroke"></div>
                    <p className="text-xs text-t-dark md:text-sm lg:text-base">
                      Expires: {deal.expiresOn.toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
              {user && (
                <p className="text-xs text-t-dark/70 md:text-sm lg:text-base">
                  Posted by: {user.nickname}
                </p>
              )}
              <DealLikes dealId={deal.id} dealName={deal.name} />
            </div>
          </div>
          <div className="hidden h-px w-full bg-gray-300 sm:block"></div>
          {/* <p className="font-normal md:text-xm">{"Location"}</p>
          <div className="mt-4 h-[70vh] max-h-[290px] w-full overflow-hidden rounded-lg md:h-[70vh] lg:h-[70vh]">
            <GoogleMap address={business.address} />
          </div>
          <div className="space-y-1">
            <p className="font-normal md:text-lg">{business.address}</p>
          </div> */}
        </div>
      </div>
    </main>
  );
}
