import { z } from "zod";

import { CorporateChat } from "@mott/db/schema";

export const otpSchema = z.object({
  otp: z.string().length(6, { message: "Access code  is required" }),
});

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email."),
});

export const fullNameSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
});

export const companySchema = z.object({
  companyName: z.string().min(3, { message: "Company name is required" }),
  companyWebsite: z.string().url({ message: "Url is not valid" }),
});

export const corporateChatSchema = z.object({
  corporateChat: z.nativeEnum(CorporateChat),
});

export type OtpForm = z.infer<typeof otpSchema>;
export type EmailForm = z.infer<typeof emailSchema>;
export type FullNameForm = z.infer<typeof fullNameSchema>;
export type CompanyForm = z.infer<typeof companySchema>;
export type CorporateChatForm = z.infer<typeof corporateChatSchema>;

export type FormValues =
  | { otp: string }
  | EmailForm
  | FullNameForm
  | CompanyForm
  | CorporateChatForm;

export type LoginForm = { otp: string } & EmailForm &
  FullNameForm &
  CompanyForm &
  CorporateChatForm;
