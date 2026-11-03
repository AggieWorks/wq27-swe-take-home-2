"use client";

import Image from "next/image";

export default function HiddenInformationIcon() {
  return (
    <div className="group flex items-center space-x-[2.5rem]">
      <Image
        src="hidden_information.svg"
        width={18}
        height={18}
        alt="Only visible to you"
      />
      <div className="absolute hidden items-center rounded-xl bg-t-secondary p-[10px] group-hover:block">
        <Image
          className="absolute -left-[15px] top-[15px]"
          src="tooltip_arrow.svg"
          width={19.5}
          height={19.5}
          alt=""
        />
        <p className="text-white">Only visible to you</p>
      </div>
    </div>
  );
}
