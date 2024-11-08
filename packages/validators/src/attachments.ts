import { z } from "zod";

export const CreatePresignedUrlSchema = z.object({
  key: z
    .string()
    .min(1, "Key cannot be empty")
    .max(1024, "Key cannot be longer than 1024 characters")
    .regex(/^[a-zA-Z0-9!_.*'()-\\/]+$/, "Key contains invalid characters"),
  temporary: z.boolean().optional(),
});

export type CreatePresignedUrlInput = z.TypeOf<typeof CreatePresignedUrlSchema>;

export const FileInfoSchema = z.object({
  key: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

export type FileInfo = z.TypeOf<typeof FileInfoSchema>;
