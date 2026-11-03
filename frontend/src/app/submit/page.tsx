"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import { ChevronLeft, FileDiff } from "lucide-react";
import { ChevronLeft } from "lucide-react";
// import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { usePostHog } from "posthog-js/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { createDeal } from "@/actions/deals";
import { uploadImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
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
import { appEnv } from "@/lib/env";
import { cn } from "@/lib/utils";
import { DealInsert, recurrenceTypeEnum } from "@/types/types";

const NEW_BUSINESS_ID = "000-0000-0000-0000-0000-0000-0000-0000";

// Define form schema using Zod
const dealFormSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  businessId: z.string().optional(),
  businessName: z.string().min(1, "Business name is required"),
  redeemInstructions: z.string().optional(),
  // redeemImage: z.instanceof(FileList).optional(),
  redeemImage: z.any(),
  expiresOn: z.string().optional(),
  recurrenceUnit: recurrenceTypeEnum.optional(),
  recurrenceDays: z.array(z.number().min(0).max(6)).optional(),
});
type FormValues = z.infer<typeof dealFormSchema>;

// Days of week for recurrence selection
const daysOfWeek = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

export default function SubmitForm() {
  // Dumb way to implement checking if a field is focused, I will fix implement a better solution later.
  const [dealNameFocus, setDealNameFocus] = useState<boolean>();
  const [dealDescriptionFocus, setDealDescriptionFocus] = useState<boolean>();
  const [storeFocus, setStoreFocus] = useState<boolean>();
  const [redeemFocus, setRedeemFocus] = useState<boolean>();

  const router = useRouter();
  const { toast } = useToast();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [recurrentSelectKey, setRecurrenceSelectKey] = useState(0);
  // const posthog = usePostHog();

  // Track form completion progress
  const [formProgress, setFormProgress] = useState(0);

  // Form with React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      name: "",
      businessName: "",
    },
    mode: "onChange",
  });

  const watchAllFields = watch();
  const watchRequiredFields = useWatch({
    control,
    name: ["name", "businessName"],
  }) as [string, string];

  useEffect(() => {
    if (
      !dealNameFocus &&
      !storeFocus &&
      !dealDescriptionFocus &&
      !redeemFocus
    ) {
      const totalFields = watchRequiredFields.length;

      const filledFields = watchRequiredFields.filter((value: unknown) => {
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "number") return value > 0;
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && value !== "";
      }).length;

      setFormProgress(Math.round((filledFields / totalFields) * 100));
    }
  }, [
    watchRequiredFields,
    dealNameFocus,
    storeFocus,
    dealDescriptionFocus,
    redeemFocus,
  ]);

  // Display preview of selected image
  const imageFile = watch("redeemImage");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Cleanup when unmounting
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const onSubmit = async (data: FormValues) => {
    // console.log("Form data on submit:", data); // Debug log

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a deal",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle image upload
      let redeemImageUrl = null;
      if (data.redeemImage && data.redeemImage.length > 0) {
        redeemImageUrl = await uploadImage(user.id, data.redeemImage[0]);
      }

      const expiresOn = data.expiresOn
        ? new Date(data.expiresOn).toISOString()
        : null;

      const dealData: DealInsert & { businessName?: string } = {
        userId: user.id,
        name: data.name,
        description: data.description || null,
        businessId: data.businessId || NEW_BUSINESS_ID,
        redeemInstructions: data.redeemInstructions || null,
        redeemImage: redeemImageUrl,
        expiresOn: expiresOn,
        recurrenceUnit: data.recurrenceUnit || null,
        recurrenceDays: data.recurrenceDays || null,
      };

      // add businessName if it's a new business to send to backend as well
      if (data.businessId === NEW_BUSINESS_ID) {
        dealData.businessName = data.businessName;
      }

      // console.log("Deal data being sent:", dealData); debug log

      const newDeal = await createDeal(dealData);

      if (!newDeal) {
        throw new Error("Failed to create deal");
      }

      toast({
        title: "Success!",
        description: "Your deal has been submitted",
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating deal:", error);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper texts for fields
  const helpTexts: Record<string, string> = {
    Title: "Enter a concise title for this deal.",
    Description: "Provide a detailed description for this deal.",
    Store: "Enter the official name so others can easily recognize it.",
    "How to Redeem": "Explain how users can redeem this deal.",
    UploadRedemptionImage: "Upload an image showing how to redeem this deal.",
    RecurrenceOptions: "Set how often this deal is available.",
  };

  // Required fields for progress tracking
  const formFields = [
    {
      label: "Title",
      value: watchAllFields.name,
      state: dealNameFocus,
    },
    {
      label: "Description",
      value: watchAllFields.description,
      state: dealDescriptionFocus,
    },
    { label: "Store", value: watchAllFields.businessName, state: storeFocus },
    {
      label: "How to Redeem",
      value:
        watchAllFields.redeemInstructions && imageFile && imageFile.length > 0,
      state: redeemFocus,
    },
  ];

  // For progress bar visualization
  const arcLength = 157;
  const progressOffset = useMemo(
    () => arcLength - (arcLength * formProgress) / 100,
    [formProgress]
  );

  // Add these state variables
  // const [open, setOpen] = useState(false);
  const [businesses, setBusinesses] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isNewBusiness, setIsNewBusiness] = useState(false);

  // Modify the existing getExistingBusinesses to update the businesses state
  const getExistingBusinesses = async (businessName: string) => {
    try {
      const response = await fetch(
        `${appEnv.BASE_API_URL}/api/business?name=${encodeURIComponent(businessName)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }
      const data = await response.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setBusinesses([]);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Back Button */}
      <div className="ml-12 mt-8 flex items-center gap-2 text-m font-semibold">
        <Link href="/" className="flex items-center gap-2">
          <ChevronLeft
            size={22}
            opacity={0.8}
            color="#DE9337"
            className="relative top-[-2px]"
          />
          <span className="text-xs font-semibold text-t-dark transition-colors hover:text-secondary sm:text-base">
            Back
          </span>
        </Link>
      </div>

      {/* Title */}
      <div className="ml-14">
        <div className="h-2"></div>
        <h1 className="mb-4 text-2xl font-semibold">
          Let&apos;s help you post a deal
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-9xl px-4">
        <div className="flex flex-col md:flex-row">
          {/* LEFT COLUMN - Progress tracker */}
          <div className="hidden min-h-[500px] w-full flex-col justify-start p-8 md:flex md:w-1/3">
            <div
              className="flex flex-col items-center rounded-lg p-6"
              style={{ backgroundColor: "#F8F9F9" }}
            >
              <p className="mb-4 text-sm text-gray-500">
                The more detailed you are, the more likely your deal will be
                seen by others
              </p>

              {/* Progress arc */}
              <svg
                width="120"
                height="70"
                viewBox="0 0 120 70"
                className="mb-2"
              >
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="15"
                />
                {/* Progress indicator */}
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke="#1C9599"
                  strokeWidth="15"
                  strokeDasharray={arcLength}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                />
              </svg>

              <div className="text-center text-3xl font-bold">
                {formProgress}%
              </div>
              <p className="mb-4 text-center text-sm text-gray-500">complete</p>

              {/* Field progress list */}
              <ul className="w-full space-y-2">
                {formFields.map((field, index: number) => {
                  const isComplete =
                    typeof field.value === "string"
                      ? field.value.trim() !== ""
                      : Boolean(field.value);

                  return (
                    <div key={index}>
                      <li className="flex items-center justify-between">
                        {/* Numbered circle */}
                        <div
                          className={cn(
                            "mr-2 flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-semibold",
                            // dealNameFocus ? "border-[]" : "",
                            field.state ? "border-[#009548]" : "",
                            isComplete && !field.state
                              ? "border-[#009548] bg-[#009548] text-white"
                              : ""
                            // : "border-gray-300 text-gray-500"
                          )}
                        >
                          <p className="mt-[2px]">{index + 1}</p>
                        </div>

                        {/* Field label */}
                        <span
                          className={cn(
                            "text-sm",
                            isComplete ? "text-[#009548]" : "text-gray-400",
                            field.state ? "text-[#009548]" : ""
                          )}
                        >
                          {field.label}
                        </span>

                        {/* Checkmark */}
                        <svg
                          className={cn(
                            "ml-auto h-9 w-5",
                            isComplete ? "text-[#009548]" : "text-gray-400"
                          )}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            d="M5 12l4 4L19 7"
                          />
                        </svg>
                      </li>

                      {/* Help text */}
                      {field.state ? (
                        <div
                          className="mt-2 rounded-md p-2"
                          style={{ backgroundColor: "#DEFAFA" }}
                        >
                          <p
                            className={`text-sm text-gray-700 ${field.state ? "text-[#009548]" : ""}`}
                          >
                            {helpTexts[field.label]}
                          </p>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      {index < formFields.length - 1 && (
                        <hr className="my-2 border-gray-300" />
                      )}
                    </div>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - Form */}
          <div className="w-full p-8 md:w-2/3">
            <h2 className="mb-1 text-xl font-semibold">
              Fill out the information below
            </h2>
            <p className="mb-4 text-sm">
              <span className="mr-1 align-middle text-2xl leading-none text-red-500">
                *
              </span>
              indicates required
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Deal Title */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center text-lg font-medium"
                >
                  <span>Deal Title</span>
                  <span className="ml-1 align-middle text-xl text-red-500">
                    *
                  </span>
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. 10% off your entire order"
                  onFocus={() => {
                    setDealNameFocus(true);
                  }}
                  onBlur={() => setDealNameFocus(false)}
                  className={cn(
                    "w-full rounded px-3 py-2",
                    errors.name ? "border-red-500" : "bg-[#EFF0F1]"
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Deal Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="flex items-center text-lg font-medium"
                >
                  <span>Deal Description</span>
                </label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="e.g. Only after 8pm"
                  onFocus={() => setDealDescriptionFocus(true)}
                  onBlur={() => setDealDescriptionFocus(false)}
                  className={cn("w-full rounded px-3 py-2", "bg-[#EFF0F1]")}
                />
              </div>

              {/* Store Name */}
              <div className="space-y-2">
                <label
                  htmlFor="businessId"
                  className="flex items-center text-lg font-medium"
                >
                  <span>Name of Restaurant / Business</span>
                  <span className="ml-1 align-middle text-xl text-red-500">
                    *
                  </span>
                </label>
                <div className="flex items-center space-x-2">
                  <span>Business</span>
                  <Controller
                    name="businessId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onOpenChange={(open) => {
                          if (open) {
                            getExistingBusinesses("");
                          }
                        }}
                        onValueChange={(value) => {
                          // console.log("Selected value:", value);
                          if (value === NEW_BUSINESS_ID) {
                            setIsNewBusiness(true);
                            field.onChange(NEW_BUSINESS_ID);
                            setValue("businessName", "");
                          } else {
                            setIsNewBusiness(false);
                            field.onChange(value); // Set the actual businessId
                            const selectedBusiness = businesses.find(
                              (b) => b.id === value
                            );
                            if (selectedBusiness) {
                              setValue("businessName", selectedBusiness.name);
                            }
                          }
                        }}
                      >
                        <SelectTrigger
                          className="w-full bg-[#EFF0F1] lg:w-[260px]"
                          onFocus={() => setStoreFocus(true)}
                          onBlur={() => setStoreFocus(false)}
                        >
                          <SelectValue placeholder="Select business" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NEW_BUSINESS_ID}>
                            Add new business...
                          </SelectItem>
                          {businesses.map((business) => (
                            <SelectItem key={business.id} value={business.id}>
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {isNewBusiness && (
                  <div className="mt-2">
                    <label
                      htmlFor="businessName"
                      className="mb-1 block text-sm text-gray-600"
                    >
                      Enter new business name
                    </label>
                    <Input
                      id="businessName"
                      {...register("businessName")}
                      placeholder="e.g. McDonald's, Starbucks, etc."
                      className={cn(
                        "w-full",
                        errors.businessName ? "border-red-500" : "bg-[#EFF0F1]"
                      )}
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.businessName.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Redemption Instructions */}
              <div className="space-y-2">
                <label
                  htmlFor="redeemInstructions"
                  className="flex items-center text-lg font-medium"
                >
                  <span>How to Redeem (Instructions)</span>
                </label>
                <Textarea
                  id="redeemInstructions"
                  {...register("redeemInstructions")}
                  placeholder="e.g. Show this deal to the cashier"
                  className={`w-full rounded bg-[#EFF0F1] px-3 py-2`}
                  onFocus={() => setRedeemFocus(true)}
                  onBlur={() => setRedeemFocus(false)}
                />
              </div>

              {/* Redeem Image */}
              <div className="space-y-2">
                <label
                  htmlFor="redeemImage"
                  className="flex items-center text-lg font-medium"
                >
                  <span>Upload Redemption Image</span>
                </label>
                <Input
                  id="redeemImage"
                  type="file"
                  accept="image/*"
                  {...register("redeemImage")}
                  className="w-full rounded bg-[#EFF0F1] px-3 py-2"
                />
                {previewImage && (
                  <div className="mt-2">
                    <Image
                      src={previewImage}
                      alt="Redemption preview"
                      width={200}
                      height={150}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Recurrence Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recurrence Options</h3>

                {/* Repeat every X unit */}
                <div className="flex items-center space-x-2">
                  <span>Repeat</span>

                  <Controller
                    name="recurrenceUnit"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={recurrentSelectKey}
                        value={field.value}
                        onValueChange={(value) => {
                          if (field.value === value) {
                            field.onChange(undefined);
                            setValue("recurrenceDays", []);
                          } else {
                            field.onChange(value);
                            // Reset recurrenceDays only if the new unit is not "week"
                            if (value !== "week") {
                              setValue("recurrenceDays", []);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px] bg-[#EFF0F1]">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">daily</SelectItem>
                          <SelectItem value="week">weekly</SelectItem>
                          {field.value && (
                            <Button
                              className="w-full px-2"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(undefined);
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

                {/* Repeat on (days of week) - only show when weekly recurrence is selected */}
                {watch("recurrenceUnit") === "week" && (
                  <div className="space-y-2">
                    <span>Repeat on</span>
                    <div className="flex space-x-2">
                      <Controller
                        name="recurrenceDays"
                        control={control}
                        render={({ field }) => (
                          <div className="flex space-x-1">
                            {daysOfWeek.map((day) => (
                              <div
                                key={day.value}
                                className={cn(
                                  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
                                  field.value?.includes(day.value)
                                    ? "bg-blue-600 text-white"
                                    : "bg-[#EFF0F1] text-gray-700"
                                )}
                                onClick={() => {
                                  const currentDays = field.value || [];
                                  if (currentDays.includes(day.value)) {
                                    // Remove the day
                                    field.onChange(
                                      currentDays.filter((d) => d !== day.value)
                                    );
                                  } else {
                                    // Add the day
                                    field.onChange([...currentDays, day.value]);
                                  }
                                }}
                              >
                                {day.label}
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Expiration Date */}
              <div className="space-y-2">
                <label
                  htmlFor="expiresOn"
                  className="flex items-center text-lg font-medium"
                >
                  <span>Expiration Date (Optional)</span>
                </label>
                <Input
                  id="expiresOn"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("expiresOn")}
                  className="w-full rounded bg-[#EFF0F1] px-3 py-2"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (!isValid &&
                      !(isNewBusiness && watchAllFields.businessName?.trim()))
                  }
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-secondary-foreground px-6 py-3 font-semibold text-t-light disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Deal"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
