"use client";

import Image from "next/image";
import { useState } from "react";

import { User } from "@/types/types";

import EditProfileModal from "./edit-profile-modal";

type ButtonProps = {
  user: User;
};

export default function AddPhoneNumberButton(props: ButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <Image
        className="cursor-pointer"
        src="add_phone_number_icon.svg"
        width={18}
        height={18}
        onClick={handleClick}
        alt="Add a phone number"
      />
      {modalOpen ? (
        <EditProfileModal
          user={props.user}
          closeModal={() => {
            setModalOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
