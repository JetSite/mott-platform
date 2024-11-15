import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  jobRole: z.string().min(1).max(50).trim(),
  instructions: z.string().optional(),
  knowledge: z.any().optional(),
});

export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
