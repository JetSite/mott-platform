import { z } from "zod";

export const CreatePresignedUrlSchema = z.object({
  key: z
    .string()
    .min(1, "Key cannot be empty")
    .max(1024, "Key cannot be longer than 1024 characters")
    .regex(/^[a-zA-Z0-9!_.*'()-\/]+$/, "Key contains invalid characters"),
});

export type CreatePresignedUrlInput = z.TypeOf<typeof CreatePresignedUrlSchema>;
