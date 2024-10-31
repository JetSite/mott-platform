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
  timezone: z.string().optional(),
  calendar: z.enum(["gregorian", "lunar"]).optional(),
  temperature: z.enum(["celsius", "fahrenheit"]).optional(),
  measurementSystem: z.enum(["metric", "imperial"]).optional(),
  firstDayOfWeek: z.number().min(0).max(6).optional(),
  dateFormat: z.string().optional(),
  numberFormat: z.string().optional(),
  currency: z.string().optional(),
  language: z.string(),
  additionalLanguage: z.string().optional(),
});

export const workspaceSettingsSchema = z.object({
  branding: brandingSchema,
  regional: regionalSchema,
});

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;
