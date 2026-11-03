import Image from "next/image";

import DealsCard from "@/components/deal/deal-card";
import DealsCarousel from "@/components/deal/deal-carousel";
import { Deal } from "@/types/types";

import SkeletonCard from "./skeleton-card";

export function DealsListLayout({
  exclusiveDeals,
  todayDeals,
  expiringDeals,
  sortedDeals,
  loading = false,
}: {
  exclusiveDeals: Deal[];
  todayDeals: Deal[];
  expiringDeals: Deal[];
  sortedDeals: Deal[];
  loading?: boolean;
}) {
  return (
    <section className="my-8 space-y-4 px-0 sm:px-4">
      {(exclusiveDeals.length > 0 || loading) && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">Dibs Exclusive Deals</span>
            <Image
              src="star.svg"
              className="mb-[6px] h-auto w-auto"
              alt="star emoji"
              width={24}
              height={24}
            />
          </div>
          {loading ? (
            <DealsCarousel deals={[]} loading />
          ) : (
            <DealsCarousel deals={exclusiveDeals} />
          )}
        </>
      )}

      {(todayDeals.length > 0 || loading) && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">Today&apos;s Deals</span>
          </div>
          {loading ? (
            <DealsCarousel deals={[]} loading />
          ) : (
            <DealsCarousel deals={todayDeals} />
          )}
        </>
      )}

      {(expiringDeals.length > 0 || loading) && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">Expiring Soon</span>
            <Image
              src="hourglass.svg"
              className="mb-[6px] h-auto w-auto"
              alt="hourglass emoji"
              width={24}
              height={24}
            />
          </div>
          {loading ? (
            <DealsCarousel deals={[]} loading />
          ) : (
            <DealsCarousel deals={expiringDeals} isExpiringSoon />
          )}
        </>
      )}

      <div className="flex items-center gap-1">
        <p className="text-lg font-semibold">All Deals</p>
      </div>
      <div className="auto-rows-fr flex-col gap-y-[1.25rem] sm:grid sm:grid-cols-2 sm:gap-x-[1.875rem] sm:gap-y-[1.5rem] lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <>
            {Array(4).fill(0).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </>
        ) : (
          <>
            {sortedDeals.map((deal, index) => (
              <DealsCard
                key={deal.id}
                deal={deal}
                showBorder={index !== sortedDeals.length - 1}
                isExpiringSoon={deal.expiresOn !== null}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
