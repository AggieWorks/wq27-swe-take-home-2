"use client";

import { SelectLabel, SelectTrigger } from "@radix-ui/react-select";
import Image from "next/image";
import { ReactNode, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SHOW_ALL = "all";

export interface FilterItem {
  id: string;
  name: string;
}

export interface SortIcons {
  id: string;
  icon: ReactNode;
}

interface FilterProps {
  value: string;
  handleChange: (value: string) => void;
  items: FilterItem[];
  bttnTitle: string;
  children?: ReactNode;
  sort?: boolean;
  sortIcons?: SortIcons[]
}

export default function FilterBttn({
  value,
  handleChange,
  items,
  bttnTitle,
  children,
  sort,
  sortIcons,
}: FilterProps) {
  const [selected, setSelected] = useState(value)
  const [open, setOpen] = useState(false)

  if (items.length == 0) {
    return (
        <button
            onClick={() => {
                const newVal = selected == SHOW_ALL ? "sort" : SHOW_ALL 
                handleChange(newVal);
                setSelected(newVal);
            }}
            className={cn(
              "flex items-center justify-between h-[30px] px-3 py-1 text-sm border border-gray-300 rounded-full flex-shrink-0",
              selected !== SHOW_ALL && "bg-gray-100"
            )}
        >
            <div className="flex items-center justify-start gap-1">
            {children}
            <p className={cn(
              "text-xs text-gray-500 pt-[2px]",
              selected !== SHOW_ALL && "text-black"
            )}>
              {bttnTitle}
            </p>
          </div>
        </button>
    )
  }

  return (
    <div className="w-max flex items-center gap-1 rounded-full border border-gray-300 flex-shrink-0">
      <Select
        value={selected}
        onValueChange={(value: string) => {handleChange(value); setSelected(value);}}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="inline-flex w-auto relative">
          <SelectTrigger
            disabled
            className="absolute w-full h-[30px] overflow-hidden opacity-0 pointer-events-none"
          />
          <button className={cn(
            "flex items-center justify-between rounded-full focus:outline-none",
            "h-[30px] px-3 py-1 gap-2 text-sm shadow-none focus:ring-0",
            (selected !== SHOW_ALL || sort) && "bg-gray-100"
          )}
            onClick={()=>setOpen(true)}
          >
            <div className="flex items-center justify-start gap-1">
              {sortIcons?.map((item) => (
                  <div key={item.id} className={cn(
                      selected !== item.id && "hidden"
                  )}>
                      {item.icon}
                  </div>
              ))}
              {children}
              <p className={cn(
                "text-xs text-gray-500 pt-[2px]",
                (selected !== SHOW_ALL || sort) && "text-black"
              )}>
                {selected !== SHOW_ALL
                  ? selected
                  : bttnTitle}
              </p>
            </div>
            <Image
              src="/drpdwn_arrow.svg"
              alt="dropdown arrow"
              width={10}
              height={5}
            />
          </button>
        </div>
        <SelectContent>
            <SelectGroup>
                {sort && 
                    <SelectLabel className="text-muted-foreground px-2 py-1.5 text-[11px]">Sort by</SelectLabel>
                }
                {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                    {item.name}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}