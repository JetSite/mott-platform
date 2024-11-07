import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@mott/db";
import { db } from "@mott/db/client";
import { Workspace } from "@mott/db/schema";
import { UpdateWorkspaceSchema } from "@mott/validators";

import { protectedProcedure } from "../trpc";

export const workspaceRouter = {
  update: protectedProcedure
    .input(UpdateWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const workspace = await db.query.Workspace.findFirst({
        where: eq(Workspace.ownerId, ctx.session.user.id),
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return await db
        .update(Workspace)
        .set({
          ...input,
          settings: input.settings
            ? {
                branding: {
                  assistant: input.settings.branding?.assistant ?? {},
                  logoFileId: input.settings.branding?.logoFileId,
                },
                regional: {
                  language: input.settings.regional?.language ?? "en",
                  ...input.settings.regional,
                },
              }
            : undefined,
        })
        .where(eq(Workspace.id, workspace.id));
    }),
} satisfies TRPCRouterRecord;
