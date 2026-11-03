"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { captureAnalytics } from "@/lib/analytics";

export default function Search() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const router = useRouter();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === "") {
      router.push(window.location.pathname);
    } else {
      // Track search event in PostHog
      captureAnalytics("search_performed", {
        search_term: search,
        current_path: window.location.pathname,
      });

      router.replace(`/?search=${search}`);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Input
          className="w-full flex-grow rounded-full bg-[#E9EBEB] pl-10 h-[36px] py-2 pb-1"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          size="icon"
          type="submit"
          className="absolute left-4 z-10 h-full w-[16px] bg-transparent hover:cursor-pointer hover:bg-transparent flex justify-center items-center"
        >
          <Image
            src="/search_icon.svg"
            alt="search icon"
            width={16}
            height={16}
            className=""
          />
        </Button>
      </form>
    </div>
  );
}
