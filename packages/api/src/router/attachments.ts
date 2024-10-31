import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CreatePresignedUrlSchema } from "@mott/validators";

import { createPresignedUrl, generateS3Key } from "~/lib/storage/s3/utils";
import { protectedProcedure } from "../trpc";

export const attachmentsRouter = {
  /**
   * Creates a presigned URL for uploading a file to S3
   * @throws {TRPCError} When the URL creation fails
   */
  createPresignedUrl: protectedProcedure
    .input(CreatePresignedUrlSchema)
    .output(
      z.object({
        url: z.string(),
        key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { key } = input;
      try {
        const newKey = generateS3Key(key, true);
        const res = await createPresignedUrl(newKey);
        return res;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            e instanceof Error ? e.message : "Error creating S3 presigned url",
        });
      }
    }),
} satisfies TRPCRouterRecord;
