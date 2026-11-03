import Head from "next/head";

import { getAllDeals } from "@/actions/deals";
import DealsList from "@/components/deal/deal-list";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsProp = await searchParams;
  const search =
    typeof searchParamsProp?.search === "string"
      ? searchParamsProp.search
      : undefined;
  const cuisineType =
    typeof searchParamsProp?.cuisineType === "string"
      ? searchParamsProp.cuisineType
      : undefined;
  const day =
    typeof searchParamsProp?.recurrence === "string"
      ? searchParamsProp.recurrence
      : undefined;
  const sortByPostedDate =
    typeof searchParamsProp?.sortBy === "string"
      ? (searchParamsProp.sortBy == "Date posted")
      : undefined;
  const dibsVerified = "dibsVerified" in searchParamsProp ? true : undefined;

  const [allDeals] = await Promise.all([
    getAllDeals(search),
  ]);

  const dayMap = new Map([
    ["Sunday", 0],
    ["Monday", 1],
    ["Tuesday", 2],
    ["Wednesday", 3],
    ["Thursday", 4],
    ["Friday", 5],
    ["Saturday", 6],
  ]);

  const deals = (() => {
    const temp = allDeals.filter((deal) => {
      const matchBusiness = cuisineType ? deal.business.cuisineType === cuisineType : true;
      const matchDay = day
        ? deal.recurrenceDays?.includes(Number(dayMap.get(day)))
        : true;
      const matchVerified = dibsVerified
        ? deal.isVerified
        : true;
      return matchBusiness && matchDay && matchVerified;
    });
    if (sortByPostedDate) {
      return temp.sort((a, b) => { return b.createdAt.getTime() - a.createdAt.getTime() });
    }
    // temp is sorted by likes, by default
    return temp;
  })()

  return (
    <>
      <Head>
        <link rel="canonical" href="http://dibs.deals" key="canonical" />
      </Head>
      <main className="px-4 xs:px-8 sm:px-16">
        <DealsList deals={deals} />
      </main>
    </>
  );
}
