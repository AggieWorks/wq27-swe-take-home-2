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
        className="flex flex-col items-center justify-center rounded-none bg-transparent sm:flex-row sm:gap-3 sm:rounded-full sm:bg-secondary-foreground sm:px-4 sm:py-2"
      >
        <Image
          src="add_deal_icon.svg"
          width={28}
          height={28}
          alt="add deal icon"
          className="hidden sm:block"
        />
        <p className="order-2 whitespace-nowrap text-sm font-semibold text-[#BB6700] sm:order-1 sm:text-base sm:font-semibold sm:text-t-light">
          Post a deal
        </p>
        <Image
          src="mobile_add_deal_icon.svg"
          width={28}
          height={28}
          alt="mobile add deal icon"
          className="block sm:hidden"
        />
      </button>
    </div>
  );
}
