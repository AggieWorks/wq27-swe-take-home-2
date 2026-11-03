"use client";

import { useState } from "react";

import { User } from "@/types/types";

import EditProfileModal from "./edit-profile-modal";

type ButtonProps = {
  user: User;
};

export default function EditProfileButton(props: ButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setModalOpen(true);
  };
  return (
    <div>
      <p
        className="cursor-pointer text-m font-semibold text-secondary"
        onClick={handleClick}
      >
        Edit
      </p>
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
