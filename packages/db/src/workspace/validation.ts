import { z } from "zod";

export const workspaceSettingsSchema = z.object({
  branding: z.object({
    logoFileId: z.string().optional(),
    assistant: z.object({
      name: z.string().optional(),
      avatarFileId: z.string().optional(),
    }),
  }),
  regional: z.object({
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
  }),
});

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;
