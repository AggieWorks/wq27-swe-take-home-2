import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/types";

export default function AvatarDropdown({ user }: { user: User }) {
  // const initials = user.nickname.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  return (
    <Link href="/profile">
      <div className="flex items-center gap-1 focus:outline-none">
        <p className="text-black h-[100%] pt-[4px] text-xs sm:text-base text-right truncate">{user.nickname}</p>
        <Avatar>
          <AvatarImage src="/avatar_dark.svg" />
          <AvatarFallback>{user.nickname}</AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
}
