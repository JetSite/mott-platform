import { z } from "zod";

export const accessCodeSchema = z.object({
  accessCode: z.string().min(6, { message: "Access code is required" }),
});

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email."),
});

export const fullNameSchema = z.object({
  fullname: z.string().min(3, { message: "Question code is required" }),
});

export const companySchema = z.object({
  companyName: z.string().min(3, { message: "Company name is required" }),
  companyWebsite: z.string().url({ message: "Url is not valid" }),
});

export const companyChatPlatform = z.object({
  companyChatPlatform: z.string(),
});

export type AccessCodeForm = z.infer<typeof accessCodeSchema>;
export type EmailForm = z.infer<typeof emailSchema>;
export type FullNameForm = z.infer<typeof fullNameSchema>;
export type CompanyForm = z.infer<typeof companySchema>;
export type CompanyChatPlatformForm = z.infer<typeof companyChatPlatform>;

export type SignUpForm = AccessCodeForm &
  EmailForm &
  FullNameForm &
  CompanyForm;
