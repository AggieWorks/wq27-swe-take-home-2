"use client";

import { useRouter } from "next/navigation";

import { deleteDeal } from "@/actions/deals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteDealModal({
  dealId,
  isOpen,
  setIsOpen,
}: {
  dealId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      // Delete the deal
      await deleteDeal(dealId);
      // Close the modal
      setIsOpen(false);
      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Are you sure you want to delete this deal?
          </DialogTitle>
          <DialogDescription className="font-medium">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
