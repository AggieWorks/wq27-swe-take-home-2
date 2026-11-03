"use client";

import { Heart } from "lucide-react";

import ManageDealDropdown from "@/components/profile/manage-deal-dropdown";
import useDealLikeInfo from "@/hooks/queries/deal-likes";
import { Deal } from "@/types/types";

import { TableCell, TableRow } from "../ui/table";

type ProfileDealListEntryProps = {
  key: string;
  deal: Deal;
};

export default function ProfileDealListEntry(props: ProfileDealListEntryProps) {
  const { data: dealLikeInfo } = useDealLikeInfo(props.deal.id);
  if (!dealLikeInfo) {
    return;
  }

  return (
    <TableRow className="border-b border-t border-[#BDC7C9]">
      <TableCell className="py-[1.75rem] pl-[1.5rem] pr-[10rem] font-semibold text-text-dark">
        {props.deal.name}
      </TableCell>
      <TableCell>{props.deal.business.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-x-[5px]">
          {dealLikeInfo.numLikes}
          <Heart fill="#FF5959" strokeWidth={0} />
        </div>
      </TableCell>
      <TableCell className="pr-[2.5rem]">
        {String(props.deal.createdAt.getMonth() + 1).padStart(2, "0")}-
        {String(props.deal.createdAt.getDay()).padStart(2, "0")}-
        {props.deal.createdAt.getFullYear()}
      </TableCell>
      <TableCell>
        <ManageDealDropdown deal={props.deal} />
      </TableCell>
    </TableRow>
  );
}
