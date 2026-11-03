'use client'

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

import { getDealsByUser } from "@/actions/deals";
import { signout } from "@/actions/user";
import AddPhoneNumberButton from "@/components/profile/add-phone-number-button";
import EditProfileButton from "@/components/profile/edit-profile-button";
import HiddenInformationIcon from "@/components/profile/hidden-information-icon";
import ProfileDealList from "@/components/profile/profile-deal-list";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/queries/user";
import { Deal } from "@/types/types";

export default function ProfilePage() {
  const {data: user} = useUser();
  const [deals, setDeals] = useState<Deal[]>([]);

  const queryClient = useQueryClient();

  console.log(deals);

  useEffect(() => {
    async function fetchDeals() {
      if (!user) return;
      setDeals(await getDealsByUser(user.id));
    }
    fetchDeals();
  }, [user]);

  const handleClick = async () => {
    await signout();
    await queryClient.refetchQueries({ queryKey: ["user"] });
  }

  return (
    <main className="fullscreen-minus-header px-[5rem] py-[2.75rem]">
      <div className="space-y-[2.75rem]">
        <div className="mx-auto space-y-[1.75rem]">
          <p className="text-l font-medium">Profile</p>
          <div className="flex space-x-[1.5rem]">
            <Image
              src="/avatar_dark.svg"
              alt="profile picture"
              width={88}
              height={88}
            />
            <div className="space-y-[0.4rem]">
              <p className="text-m font-semibold">{user?.nickname}</p>
              <div className="flex items-center space-x-[0.5rem]">
                <p className="text-m">{user?.email}</p>
                <HiddenInformationIcon />
              </div>
              <div className="flex items-center space-x-[0.5rem]">
                <p className="text-m text-text-med">
                  {user?.phone == "" ? "Add phone number" : user?.phone}
                </p>
                {user?.phone == "" ? (
                  <AddPhoneNumberButton user={user} />
                ) : (
                  <HiddenInformationIcon />
                )}
              </div>
            </div>
            <div className="absolute right-[5rem] top-[18.75rem]">
              {user ? <EditProfileButton user={user} /> : null}
            </div>
          </div>
        </div>
        <div className="mx-auto space-y-[1rem]">
          <p className="text-l font-medium">
            Activity <span className="text-t-secondary">({deals.length})</span>
          </p>
          <ProfileDealList deals={deals} />
        </div>
        <div className="py-[0.5rem]" />
        <Button variant="destructive" onClick={handleClick}>
          Signout
        </Button>
      </div>
    </main>
  );
}
