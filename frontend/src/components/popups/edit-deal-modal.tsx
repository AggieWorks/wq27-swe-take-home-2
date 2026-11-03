"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateDeal } from "@/actions/deals";
import { uploadImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/queries/user";
import { useToast } from "@/hooks/use-toast";
import { resolvePublicImageUrl } from "@/lib/image-url";
import { Deal, recurrenceTypeEnum } from "@/types/types";

// Define form schema using Zod
const dealFormSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  store: z.string().min(1, "Store name is required"),
  redeemInstructions: z.string().optional(),
  redeemImage: z.instanceof(FileList).optional(),
  expiresOn: z.string().optional(),
  recurrenceUnit: recurrenceTypeEnum.optional(),
  recurrenceDays: z.array(z.number().min(0).max(6)).optional(),
});

type FormValues = z.infer<typeof dealFormSchema>;

export default function EditDealModal({
  deal,
  isOpen,
  setIsOpen,
}: {
  deal: Deal;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    control,
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      name: deal.name,
      description: deal.description ?? "",
      expiresOn: deal.expiresOn
        ? deal.expiresOn.toISOString().split("T")[0]
        : "",
      recurrenceUnit: deal.recurrenceUnit ?? undefined,
      recurrenceDays: deal.recurrenceDays ?? [],
      store: deal.business.name ?? "",
      redeemInstructions: deal.redeemInstructions ?? "",
    },
  });
  const [previewImage, setPreviewImage] = useState<string | null>(
    deal.redeemImage ? resolvePublicImageUrl(deal.redeemImage) : null
  );
  const [recurrenceSelectKey, setRecurrenceSelectKey] = useState(0);
  const { data: user } = useUser();

  const onSubmit = handleSubmit(async (data) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a deal",
        variant: "destructive",
      });
      return;
    }

    // Check if weekly recurrence is selected and no days are selected
    if (
      data.recurrenceUnit === "week" &&
      (data.recurrenceDays === undefined || data.recurrenceDays?.length === 0)
    ) {
      toast({
        title: "Error",
        description: "You must select at least one day of the week",
        variant: "destructive",
      });
      return;
    }

    try {
      const image = data.redeemImage?.[0];
      let uploadedUrl;
      if (image) {
        uploadedUrl = await uploadImage(user.id, image);
      }
      const updatedDeal = await updateDeal(deal.id, {
        userId: user.id,
        businessId: deal.businessId,
        name: data.name,
        description: data.description || null,
        redeemInstructions: data.redeemInstructions || null,
        redeemImage: uploadedUrl || deal.redeemImage,
        expiresOn: data.expiresOn
          ? new Date(data.expiresOn).toISOString()
          : null,
        recurrenceUnit: data.recurrenceUnit || null,
        recurrenceDays: data.recurrenceDays || null,
      });

      if (!updatedDeal) {
        throw new Error("Failed to update deal");
      }

      toast({
        title: "Success!",
        description: "Your deal has been updated",
      });
      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error updating deal:", error);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOpen(false);
    }
  });

  // Watch file input changes
  const imageFile = watch("redeemImage");
  useEffect(() => {
    if (!imageFile) {
      return;
    }
    if (imageFile?.length > 0) {
      const file = imageFile[0];
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(
        deal.redeemImage ? resolvePublicImageUrl(deal.redeemImage) : null
      );
    }
  }, [imageFile, deal.redeemImage]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogContent className="max-h-[80vh] overflow-y-scroll lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle className="font-semibold">Edit deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Deal Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Input
              type="text"
              id="name"
              {...register("name", { required: true })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name?.type === "required" && (
              <p role="alert" className="text-sm text-destructive">
                Deal title is required
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <label
              htmlFor="expiresOn"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <Input
              id="expiresOn"
              type="date"
              {...register("expiresOn")}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Recurrence  Unit */}
          <div className="flex space-x-4">
            <div className="space-y-2">
              <label
                htmlFor="recurrenceUnit"
                className="block text-sm font-medium text-gray-700"
              >
                Repeat
              </label>
              <Controller
                control={control}
                name="recurrenceUnit"
                render={({ field: { onChange, value } }) => (
                  <Select
                    key={recurrenceSelectKey}
                    value={value}
                    onValueChange={(newValue) => {
                      if (value === newValue) {
                        onChange(undefined);
                        setValue("recurrenceDays", []);
                      } else {
                        onChange(newValue);
                        // Reset recurrenceDays only if the new unit is not "week"
                        if (newValue !== "week") {
                          setValue("recurrenceDays", []);
                        }
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">daily</SelectItem>
                      <SelectItem value="week">weekly</SelectItem>
                      {value && (
                        <Button
                          className="w-full px-2"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(undefined);
                            setRecurrenceSelectKey(+new Date());
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Recurrence Days */}
          {watch("recurrenceUnit") === "week" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Repeat on
              </label>
              <div className="flex space-x-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-8 w-8 rounded-full ${watch("recurrenceDays")?.includes(index) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => {
                      const currentDays = watch("recurrenceDays");
                      if (currentDays?.includes(index)) {
                        setValue(
                          "recurrenceDays",
                          currentDays.filter((d) => d !== index)
                        );
                      } else {
                        setValue("recurrenceDays", [
                          ...(currentDays || []),
                          index,
                        ]);
                      }
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Store */}
          <div className="space-y-2">
            <label
              htmlFor="store"
              className="block text-sm font-medium text-gray-700"
            >
              Name of Restaurant / Business
            </label>
            <Input
              type="text"
              id="store"
              {...register("store", { required: true })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
              aria-invalid={errors.store ? "true" : "false"}
            />
            {errors.store?.type === "required" && (
              <p role="alert" className="text-sm text-destructive">
                Store name is required
              </p>
            )}
          </div>

          {/* Redeem Instructions */}
          <div className="space-y-2">
            <label
              htmlFor="redeemInstructions"
              className="block text-sm font-medium text-gray-700"
            >
              Redemption Instructions
            </label>
            <Textarea
              id="redeemInstructions"
              {...register("redeemInstructions")}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Redemption Image
            </label>
            <Input
              id="redeemImage"
              type="file"
              accept="image/*"
              {...register("redeemImage")}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          {previewImage && (
            <Image
              src={previewImage}
              alt="Redemption Preview"
              width={148}
              height={94}
              className="rounded-sm"
            />
          )}

          <DialogFooter className="mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
