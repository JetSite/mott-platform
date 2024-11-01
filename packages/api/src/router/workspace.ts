import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const workspaceRouter = {
  get: protectedProcedure.query(async ({ ctx }) => {
    return null;
  }),
} satisfies TRPCRouterRecord;
