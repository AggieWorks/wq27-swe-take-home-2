"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/queries/user";
import { captureAnalytics } from "@/lib/analytics";
import { isLoginModalOpenAtom } from "@/lib/atoms";

export default function SubmitDeal() {
  const { data: user } = useUser();
  const router = useRouter();
  const [, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);
  const handleClick = () => {
    if (!user) {
      captureAnalytics("post_deal_clicked", {
        status: "login_required",
      });
      setIsLoginModalOpen(true);
      return;
    }
    captureAnalytics("post_deal_clicked", {
      status: "navigating_to_submit",
      user_id: user.id,
    });
    router.push("/submit");
  };

  return (
    <div className="">
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center rounded-none bg-transparent sm:flex-row sm:gap-2 sm:rounded-full sm:bg-primary sm:hover:bg-[#002122] sm:px-6 sm:py-2 sm:h-full overflow-hidden"
      >
        <Image
          src="/mobile_add_deal_icon.svg"
          width={20}
          height={20}
          alt="mobile add deal icon"
          className="block sm:hidden"
        />
        <p className="h-[20px] text-center whitespace-nowrap text-sm font-semibold text-[#0A1C1E] sm:text-base sm:font-semibold sm:text-t-light">
          Post a deal
        </p>
        <Image
          src="/add_deal_icon.svg"
          width={20}
          height={20}
          alt="add deal icon"
          className="hidden sm:block"
        />
      </button>
    </div>
  );
}
