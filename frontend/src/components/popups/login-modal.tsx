"use client";

import { useAtom } from "jotai";

import GoogleSignInButton from "@/components/google-sign-in-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isLoginModalOpenAtom } from "@/lib/atoms";

export default function LoginModal() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Login for more features!
          </DialogTitle>
          <DialogDescription className="font-medium">
            Sign in to save your favorite deals and submit your own deals.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mx-auto">
          <GoogleSignInButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
