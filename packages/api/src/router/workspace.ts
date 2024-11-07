import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@mott/db";
import { db } from "@mott/db/client";
import { Workspace } from "@mott/db/schema";
import { UpdateWorkspaceSchema } from "@mott/validators";

import { protectedProcedure } from "../trpc";

export const workspaceRouter = {
  update: protectedProcedure
    .input(UpdateWorkspaceSchema)
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await db.update(Workspace).set(rest).where(eq(Workspace.id, id));
    }),
} satisfies TRPCRouterRecord;
