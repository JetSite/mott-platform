import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1),
  jobRole: z.string().min(1),
  instructions: z.string().optional(),
  knowledge: z.any().optional(),
});

export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
