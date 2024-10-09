import { z } from "zod";

export const settingsSchema = z.object({
  workspaceName: z.string(),
  logo: z.any(),
  assistantName: z.string(),
  assistantLogo: z.any(),
  country: z.string(),
  language: z.string(),
});

export type SettingsForm = z.infer<typeof settingsSchema>;
