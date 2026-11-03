"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";

import { updateUser } from "@/actions/user";
import usePhoneInput from "@/hooks/use-phone-input";
import { User } from "@/types/types";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";

type ModalProps = {
  closeModal: () => void;
  user: User;
};

const EditProfileModal = (props: ModalProps) => {
  const handleClose = () => {
    props.closeModal();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userNickname, setUserNickname] = useState(props.user.nickname);
  const { phone, handlePhoneChange } = usePhoneInput(props.user.phone);

  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (phone !== "" && !isValidPhoneNumber(phone)) {
      setIsSubmitting(false);
      return;
    }

    const userUpdate = {
      nickname: userNickname,
      phone: phone,
    };

    if (phone.trim() !== "") {
      userUpdate.phone = phone;
    }

    try {
      updateUser(userUpdate);
    } catch (err) {
      console.error("Error updating user", err);
    } finally {
      setIsSubmitting(false);
      handleClose();
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative h-[34.625rem] w-[37rem] rounded-lg bg-white p-[3rem]">
        <Image
          className="absolute right-[3rem] top-[3rem] cursor-pointer"
          onClick={handleClose}
          src="x.svg"
          width={14.13}
          height={14.13}
          alt="close"
        />
        <div className="flex flex-col items-center space-y-[1.5rem]">
          <p className="text-l font-medium">Edit Profile</p>
          <div className="flex flex-col items-center space-y-[1.125rem]">
            <Image
              src="avatar_dark.svg"
              width={88}
              height={88}
              alt="profile picture"
            />
            <p className="text-m text-text-med">{props.user.email}</p>
          </div>
          <div className="w-full space-y-[0.75rem]">
            <p className="text-m text-text-med">Display Name</p>
            <Input
              spellCheck="false"
              onChange={(e) => {
                setUserNickname(e.target.value);
              }}
              defaultValue={props.user.nickname}
              className="w-full rounded-xl border-[#BDC7C9]"
            />
          </div>
          <div className="w-full space-y-[0.75rem]">
            <p className="text-m text-text-med">Phone Number</p>
            <PhoneInput onChange={handlePhoneChange} value={props.user.phone} />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-full bg-secondary-foreground hover:bg-secondary-hover"
          >
            {isSubmitting ? "Saving changes..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
