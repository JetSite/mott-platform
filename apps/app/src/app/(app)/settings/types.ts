import { z } from "zod";

export const settingsSchema = z.object({
  workspaceName: z.string(),
  logo: z.any(),
  assistantName: z.string(),
  assistantLogo: z.any(),
  region: z.string(),
  language: z.string(),
});

export type SettingsForm = z.infer<typeof settingsSchema>;
