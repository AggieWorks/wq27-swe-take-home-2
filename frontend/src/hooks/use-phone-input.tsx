import { useCallback, useEffect, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";

import { subscribe } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { identifyAnalytics } from "@/lib/analytics";

/**
 * Handles phone number inputs and modal visibility
 * @param storageKey
 * @returns
 */

export default function usePhoneInput(
  initialValue = "",
  storageKey = "hasSeenModal"
) {
  const [phone, setPhone] = useState(initialValue);
  const [showError, setShowError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  // Check if the user has seen the modal before
  useEffect(() => {
    const hasSeenModal = localStorage.getItem(storageKey);
    if (!hasSeenModal) {
      setIsOpen(true);
      localStorage.setItem(storageKey, "true");
    }
  }, [storageKey]);

  const handlePhoneChange = useCallback(
    (value: string | undefined) => {
      setPhone(value || "");
      if (showError) setShowError(false);
    },
    [showError]
  );

  /**
   * Handles the sign up button click
   */
  const handleSignUp = () => {
    setIsPending(true);
    if (!isValidPhoneNumber(phone)) {
      setIsPending(false);
      setShowError(true);
      return;
    }
    subscribe(phone)
      .then((user) => {
        setIsOpen(false);
        identifyAnalytics(user.phone);
        toast({
          title: "Success!",
          description: "You've successfully signed up for SMS notifications.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return {
    phone,
    isOpen,
    setIsOpen,
    handlePhoneChange,
    handleSignUp,
    isPending,
    showError,
  };
}
