import { z } from "zod";

export const profileSchema = z.object({
  fullname: z.string().min(3, { message: "Fullname is required" }),
  role: z.string().min(3, { message: "Role is required" }),
});

export const customInstructionsSchema = z.object({
  instructions: z.string(),
  knowledge: z.any(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
export type CustomInstructionsForm = z.infer<typeof customInstructionsSchema>;
