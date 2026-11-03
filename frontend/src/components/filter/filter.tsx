"use client";

import { Clock3 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { type Business,getAllBusinesses } from "@/actions/businesses";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import FilterBttn, { FilterItem } from "./filter-button";

const SHOW_ALL = "all";

const daysOfTheWeek: FilterItem[] = [
  {
    id: "Sunday",
    name: "Sunday",
  },
  {
    id: "Monday",
    name: "Monday",
  },
  {
    id: "Tuesday",
    name: "Tuesday",
  },
  {
    id: "Wednesday",
    name: "Wednesday",
  },
  {
    id: "Thursday",
    name: "Thursday",
  },
  {
    id: "Friday",
    name: "Friday",
  },
  {
    id: "Saturday",
    name: "Saturday",
  },
];

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const cuisines = useMemo(() => {
    const cuisinesTypes : string[] = [];
    allBusinesses.forEach(business => {
      const ct = business.cuisineType;
      if (!cuisinesTypes.includes(ct) && ct!="") cuisinesTypes.push(ct);
    });
    return cuisinesTypes.map((ct) => { return {id: ct, name: ct} });
  }, [allBusinesses]);

  const cuisine = searchParams.get('cuisineType') ?? SHOW_ALL;
  const recurrence = searchParams.get('recurrence') ?? SHOW_ALL;
  const sort = searchParams.get('sortBy') ?? SHOW_ALL;
  const verified = searchParams.get('dibsVerified') ?? SHOW_ALL;

  useEffect(() => {
    async function init() {
      setAllBusinesses(await getAllBusinesses())
    }
    init()
  }, [])

  const handleChange = (value: string, searchparam: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === SHOW_ALL) {
      current.delete(searchparam);
    } else {
      current.set(searchparam, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/${query}`);
  };

  return (
    <div className="max-w-full flex items-center justify-start mx-2 sm:ml-0 overflow-hidden">
      <Image
        src="/filter-icon.svg"
        alt="filter icon"
        width={17}
        height={17}
        className="sm:hidden"
      />
      <Image
        src="/horizontal-filter-icon.svg"
        alt="filter icon"
        width={17}
        height={17}
        className="hidden sm:flex"
      />
      <p className="hidden sm:flex text-[#0A1C1E] ml-2 pt-[2px] text-xs">Filters</p>
      <div className="flex-shrink-0 w-[1px] h-[26px] ml-4 bg-gray-300 rounded-sm" />
      <div className="flex-1 overflow-x-auto">
        <Carousel
          opts={{
            align: "start",
            skipSnaps: false,
            slidesToScroll: 1,
            dragFree: true,
          }}
        >
          <CarouselContent className="flex gap-[10px] lg:gap-5 pl-6 pr-0 sm:pl-8">
            <CarouselItem className="p-0 m-0 basis-auto">
              <FilterBttn 
                value={cuisine} 
                handleChange={(value) => handleChange(value, "cuisineType")} 
                items={[{id: SHOW_ALL, name: "(no filter)"}, ...cuisines]} 
                bttnTitle="Cuisine Type"
              >
                <Image
                  src="/cuisine_icon.svg"
                  alt="cuisine filter icon"
                  width={14}
                  height={14}
                />
              </FilterBttn>
            </CarouselItem>

            <CarouselItem className="p-0 ml-0 basis-auto">
              <FilterBttn 
                value={recurrence} 
                handleChange={(value) => handleChange(value, "recurrence")} 
                items={[{id: SHOW_ALL, name: "(no filter) "}, ...daysOfTheWeek]} 
                bttnTitle="Recurring on"
              >
                <Image
                  src="/calendar.svg"
                  alt="day of the week filter icon"
                  width={12}
                  height={12}
                />
              </FilterBttn>
            </CarouselItem>

            <CarouselItem className="p-0 ml-0 basis-auto">
              <FilterBttn 
                value={sort} 
                handleChange={(value) => handleChange(value, "sortBy")} 
                items={[{id: SHOW_ALL, name: "Most liked (default)"}, {id: "Date posted", name: "Date posted"}]} 
                bttnTitle="Most liked"
                sort
                sortIcons={[
                  {
                    id: SHOW_ALL,
                    icon: 
                      <Image
                        src="/heart.svg"
                        alt="most liked sorting icon"
                        width={14}
                        height={14}
                      />
                  },
                  {
                    id: "Date posted",
                    icon: 
                      <Clock3 
                        size={15}
                        className="text-[#8C8C8C]"
                      />
                  }
                ]}
              />
            </CarouselItem>

            <CarouselItem className="p-0 ml-0 basis-auto">
              <FilterBttn 
                value={verified} 
                handleChange={(value) => handleChange(value, "dibsVerified")} 
                items={[]} 
                bttnTitle="Dibs verified"
              >
                <Image
                  src="/verify-vector-grey.svg"
                  alt="dibs verified filter icon"
                  width={16}
                  height={16}
                />
              </FilterBttn>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
