import { z } from "zod";

export const CreatePresignedUrlSchema = z.object({
  key: z.string(),
});

export type CreatePresignedUrlInput = z.TypeOf<typeof CreatePresignedUrlSchema>;
