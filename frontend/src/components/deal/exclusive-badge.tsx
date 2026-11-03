import Image from "next/image";

import { Badge } from "@/components/ui/badge";

export default function ExclusiveBadge() {
  return (
    <Badge className="absolute left-1 top-1 z-10 flex gap-1 rounded-full sm:left-2 sm:top-2">
      <p className="hidden text-[0.75rem] font-medium sm:block">
        Dibs Exclusive
      </p>
      <Image
        src="/star.svg"
        className="mb-[2px]"
        alt="star emoji"
        width={16}
        height={16}
      />
    </Badge>
  );
}
