import DealsCard from "@/components/deal/deal-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Deal } from "@/types/types";

import SkeletonCard from "./skeleton-card";

export default function DealsCarousel({
  deals,
  isExpiringSoon = false,
  loading = false,
}: {
  deals: Deal[];
  isExpiringSoon?: boolean;
  loading?: boolean;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        skipSnaps: false,
        slidesToScroll: 1,
      }}
    >
      <CarouselContent className="-ml-4">
        {loading ?
          Array(4).fill(0).map((_, idx) => (
            <CarouselItem
              key={idx}
              className={cn(
                "basis-[60%] pl-4",
                "md:basis-1/3 lg:basis-1/4"
              )}
            >
              <SkeletonCard isInCarousel />
            </CarouselItem>
          )) 
          :
          deals.map((deal, index) => (
            <CarouselItem
              key={deal.id}
              className={cn(
                "basis-[60%] pl-4",
                deals.length >= 2 && "",
                deals.length >= 3 && "md:basis-1/3",
                deals.length >= 4 && "lg:basis-1/4"
              )}
            >
              <DealsCard
                deal={deal}
                isExpiringSoon={isExpiringSoon}
                isFirst={index === 0}
                isInCarousel
              />
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
