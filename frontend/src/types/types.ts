import { z } from "zod";

export const recurrenceTypeEnum = z.enum(["day", "week"]);

export const businessHourSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  dayOfWeek: z.number(),
  openTime: z.number(),
  closeTime: z.number(),
  isClosed: z.boolean(),
  createdAt: z.string().pipe(z.coerce.date()),
  updatedAt: z.string().pipe(z.coerce.date()),
});

export const businessSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  image: z.string(),
  hours: z.array(businessHourSchema).nullable(),
  createdAt: z.string().pipe(z.coerce.date()),
  updatedAt: z.string().pipe(z.coerce.date()),
  cuisineType: z.string(),
});

export const dealSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  businessId: z.string().uuid(),
  business: businessSchema,
  redeemImage: z.string().nullable(),
  redeemInstructions: z.string().nullable(),
  expiresOn: z.string().pipe(z.coerce.date()).nullable(),
  isExclusive: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  recurrenceUnit: recurrenceTypeEnum.nullable(),
  recurrenceDays: z.array(z.number().int().min(0).max(6)).nullable(),
  createdAt: z.string().pipe(z.coerce.date()),
  updatedAt: z.string().pipe(z.coerce.date()),
});

export const dealInsertSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  businessId: z.string().uuid(),
  redeemImage: z.string().nullable(),
  redeemInstructions: z.string().nullable(),
  expiresOn: z.string().nullable(),
  recurrenceUnit: recurrenceTypeEnum.nullable(),
  recurrenceDays: z.array(z.number().int().min(0).max(6)).nullable(),
});

export const likeSchema = z.object({
  userId: z.string().uuid(),
  dealId: z.string().uuid(),
  createdAt: z.string().pipe(z.coerce.date()),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  optedIn: z.boolean(),
  role: z.enum(["user", "admin"]),
  email: z.string().email(),
  nickname: z.string(),
  createdAt: z.string().pipe(z.coerce.date()),
  updatedAt: z.string().pipe(z.coerce.date()),
});

export const userUpdateSchema = z.object({
  phone: z.string().nullable(),
  nickname: z.string(),
});

// Export enums
export type RecurrenceType = z.infer<typeof recurrenceTypeEnum>;

// Export types
export type Deal = z.infer<typeof dealSchema>;
export type DealInsert = z.infer<typeof dealInsertSchema>;

export type User = z.infer<typeof userSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export interface UserProps {
  user: User | null;
}
