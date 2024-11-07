import { z } from "zod";

const brandingSchema = z.object({
  logoFileId: z.string().optional(),
  assistant: z.object({
    name: z.string().min(2).max(50).optional(),
    avatarFileId: z.string().optional(),
  }),
});
const regionalSchema = z.object({
  region: z.string().optional(),
  timezone: z
    .string()
    .refine(
      (tz) => {
        try {
          return Intl.supportedValuesOf("timeZone").includes(tz);
        } catch {
          return false;
        }
      },
      {
        message: "Invalid timezone. Use IANA Time Zone format",
      },
    )
    .optional(),
  calendar: z.enum(["gregorian", "lunar"]).optional(),
  temperature: z.enum(["celsius", "fahrenheit"]).optional(),
  measurementSystem: z.enum(["metric", "imperial"]).optional(),
  firstDayOfWeek: z.number().min(0).max(6).optional(),
  dateFormat: z
    .string()
    .regex(
      /^(?!.*([DMY])\1)(?=.*DD)(?=.*MM)(?=.*YYYY)(DD|MM|YYYY)[-/.](DD|MM|YYYY)[-/.](DD|MM|YYYY)$/,
    )
    .optional(),
  numberFormat: z
    .string()
    .regex(/^[#,]*[.][0-9]+$|^[#,]+$/)
    .optional(),
  currency: z.string().optional(),
  language: z
    .string()
    .regex(/^[a-z]{2}$/)
    .default("en"),
  additionalLanguage: z
    .string()
    .regex(/^[a-z]{2}$/)
    .optional(),
});

export const workspaceSettingsSchema = z.object({
  branding: brandingSchema,
  regional: regionalSchema,
});

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;
