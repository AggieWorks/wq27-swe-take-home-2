import { getAllDeals } from "@/actions/deals";
import { getDealLikeInfo } from "@/actions/deals";
import Logo from "@/components/branding/logo";
import { Deal } from "@/types/types";

import { DealsListLayout } from "./deals-list-layout";

export default async function DealsList({
  deals: propDeals,
  search,
}: {
  deals?: Deal[];
  search?: string;
}) {
  const deals: Deal[] = propDeals || (await getAllDeals(search));

  const dealsWithLikes = await Promise.all(
    deals.map(async (deal) => {
      const likeInfo = await getDealLikeInfo(deal.id);
      return {
        ...deal,
        numLikes: likeInfo?.numLikes || 0,
      };
    })
  );

  const sortedDeals = [...dealsWithLikes].sort(
    (a, b) => b.numLikes - a.numLikes
  );

  const today = new Date().getDay();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const todayDeals = sortedDeals.filter((deal) => {
    if (!deal.recurrenceUnit) {
      return false;
    }

    if (deal.recurrenceUnit === "day") {
      return true;
    }

    if (deal.recurrenceUnit === "week" && deal.recurrenceDays) {
      if (!deal.recurrenceDays.includes(today)) {
        return false;
      }

      return true;
    }

    return false;
  });

  const exclusiveDeals = sortedDeals.filter((deal) => deal.isExclusive);
  const expiringDeals = sortedDeals
    .filter((deal) => deal.expiresOn && deal.expiresOn >= new Date())
    .sort((a, b) => {
      const dateA = a.expiresOn ? new Date(a.expiresOn) : new Date();
      const dateB = b.expiresOn ? new Date(b.expiresOn) : new Date();
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <>
      {deals.length > 0 ? (
        <DealsListLayout
          exclusiveDeals={exclusiveDeals}
          todayDeals={todayDeals}
          expiringDeals={expiringDeals}
          sortedDeals={sortedDeals}
        />
      ) : (
        <div className="mt-36 flex flex-col items-center justify-center gap-5">
          <h1 className="text-xl font-semibold tracking-wide">No Deals</h1>
          <Logo />
          <p>Check back later for freshly baked deals!</p>
        </div>
      )}
    </>
  );
}
