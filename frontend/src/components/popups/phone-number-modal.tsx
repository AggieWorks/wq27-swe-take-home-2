"use client";

import { DialogProps } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneInput } from "@/components/ui/phone-input";
import usePhoneInput from "@/hooks/use-phone-input";

export default function PhoneNumberModal(props: DialogProps) {
  const {
    phone,
    isOpen,
    setIsOpen,
    handlePhoneChange,
    handleSignUp,
    isPending,
    showError,
  } = usePhoneInput();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Sign up for SMS notifications!
          </DialogTitle>
          <DialogDescription className="font-medium">
            Stay up to date with the latest deals by signing up for text.
          </DialogDescription>
        </DialogHeader>
        <PhoneInput
          defaultCountry="US"
          value={phone}
          onChange={handlePhoneChange}
          error={showError}
        />
        <DialogFooter className="flex-col gap-2">
          <div className="flex gap-2">
            <Checkbox
              id="consent-checkbox"
              onCheckedChange={(checked) =>
                setIsChecked(checked.valueOf() === true)
              }
            />
            <div className="space-y-2">
              <label htmlFor="consent-checkbox" className="text-[0.625rem]">
                By subscribing, you agree to receive SMS updates from Dibs such
                as promotional offers and notifications. Message frequency may
                vary. Standard message and data rates may apply. Reply STOP to
                opt out.{" "}
              </label>
              <Link
                href="privacy-policy.html"
                className="block text-[0.625rem] font-medium text-secondary hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => handleSignUp()}
            disabled={isPending || !isChecked}
          >
            Sign me up!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
