"use client";

import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import usePhoneInput from "@/hooks/use-phone-input";

export default function SMSInput() {
  const { phone, handlePhoneChange, handleSignUp, isPending, showError } =
    usePhoneInput();
  return (
    <>
      <PhoneInput
        defaultCountry="US"
        value={phone}
        onChange={handlePhoneChange}
        error={showError}
      />
      <Button
        className="w-full"
        onClick={() => handleSignUp()}
        disabled={isPending}
      >
        Sign up for text notifications!
      </Button>
    </>
  );
}
