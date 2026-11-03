import Head from "next/head";

import { DealsListLayout } from "@/components/deal/deals-list-layout";

export default function Loading() {
  return (
    <>
      <Head>
        <link rel="canonical" href="http://dibs.deals" key="canonical" />
      </Head>
      <main className="fullscreen-minus-header px-4 pt-10 xs:px-8 sm:px-16">
        <DealsListLayout
          exclusiveDeals={[]}
          todayDeals={[]}
          expiringDeals={[]}
          sortedDeals={[]}
          loading
        />
      </main>
    </>
  );
}
