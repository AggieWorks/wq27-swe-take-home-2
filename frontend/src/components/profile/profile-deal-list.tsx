"use client";

import { useState } from "react";

import ProfileDealListEntry from "@/components/profile/profile-deal-list-entry";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Deal } from "@/types/types";

type ProfileDealListProps = {
  deals: Deal[];
};

export default function ProfileDealList(props: ProfileDealListProps) {
  const [tableHeight, setTableHeight] = useState(27);
  const [numDealsShown, setNumDealsShown] = useState(
    Math.min(5, props.deals.length)
  );

  const expandList = () => {
    const numNewDeals = Math.min(5, props.deals.length - numDealsShown);
    setTableHeight(tableHeight + 4.8 * numNewDeals);
    setNumDealsShown(numDealsShown + numNewDeals);
  };

  return (
    <div>
      <div
        className={`h-[${tableHeight}rem] overflow-hidden rounded-t-lg border border-[#BDC7C9] transition-all duration-1000`}
      >
        <Table>
          <TableHeader className="bg-[#F8F8F8]">
            <TableRow className="border-b border-[#BDC7C9]">
              <TableHead className="pl-[1.5rem] pr-[10rem] text-text-med">
                Deal Title
              </TableHead>
              <TableHead className="text-text-med">
                Name of Restaurant
              </TableHead>
              <TableHead className="justify-center text-text-med">
                Likes
              </TableHead>
              <TableHead className="pr-[2.5rem] text-text-med">
                Date Posted
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.deals.map((deal) => (
              <ProfileDealListEntry key={deal.id} deal={deal} />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex h-[4.8rem] items-center justify-center space-x-[0.75rem] border border-t-0 border-[#BDC7C9]">
        <p className="text-xs font-semibold text-text-med">
          {props.deals.length == 0
            ? "You have not posted any deals."
            : "Showing 1-" + numDealsShown + " out of " + props.deals.length}
        </p>
        {numDealsShown >= props.deals.length ? null : (
          <p
            className="cursor-pointer text-m font-semibold text-secondary underline"
            onClick={expandList}
          >
            Load more
          </p>
        )}
      </div>
    </div>
  );
}
