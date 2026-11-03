import { Deal } from "@/types/types";

export function useDealFilters(deals: Deal[]) {
  // Get today's day of week (0-6, where 0 is Sunday)
  const today = new Date().getDay();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // Filter exclusive deals
  const exclusiveDeals = deals.filter((deal) => deal.isExclusive);

  // Filter expiring deals
  const expiringDeals = deals
    .filter((deal) => deal.expiresOn && deal.expiresOn >= new Date())
    .sort((a, b) => {
      const dateA = a.expiresOn ? new Date(a.expiresOn) : new Date();
      const dateB = b.expiresOn ? new Date(b.expiresOn) : new Date();
      return dateA.getTime() - dateB.getTime();
    });

  // Filter deals that occur today based on recurrence pattern
  const todayDeals = deals.filter((deal) => {
    // If deal has no recurrence pattern, it's not a recurring deal
    if (!deal.recurrenceUnit) {
      return false;
    }

    // For daily recurrence, check if today is a multiple of recurrenceFrequency days from creation date
    if (deal.recurrenceUnit === "day") {
      return true;
    }

    // For weekly recurrence, check if today is in the recurrenceDays array and if this is the correct week
    if (deal.recurrenceUnit === "week" && deal.recurrenceDays) {
      // First check if today is one of the recurrence days
      if (!deal.recurrenceDays.includes(today)) {
        return false;
      }

      return true;
    }

    return false;
  });

  return {
    exclusiveDeals,
    expiringDeals,
    todayDeals,
  };
}
