import { z } from "zod";

// Shared (client + server) validation for Wholesale Inquiry submissions

export const yearsInBusinessValues = [
  "less-than-1",
  "1-2",
  "3-5",
  "6-10",
  "10-plus",
] as const;

export const yearsInBusinessOptions = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-2", label: "1-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "10-plus", label: "10+ years" },
] as const;

export const wholesaleInquirySchema = z.object({
  name: z.string().min(2, "Your name is required"),
  email: z
    .string()
    .min(1, "Your email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Your phone is required")
    .refine((val) => val.replace(/\D/g, "").length >= 10, "Please enter a valid phone number"),

  businessName: z.string().min(2, "Your business name is required"),
  businessNumber: z.string().min(1, "Your business number is required"),
  businessAddress: z.string().min(5, "Your business address is required"),

  yearsInBusiness: z.enum(yearsInBusinessValues, {
    required_error: "Please select how long you've been in business",
  }),

  brandsCarried: z.string().min(2, "Please list the brands you currently carry"),
  brandsInterested: z.string().min(2, "Please list the brands you'd like to carry"),

  additionalInfo: z.string().optional().or(z.literal("")),
});

export type WholesaleInquiryInput = z.infer<typeof wholesaleInquirySchema>;

