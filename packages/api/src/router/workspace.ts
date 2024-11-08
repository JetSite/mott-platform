import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@mott/db";
import { db } from "@mott/db/client";
import { File, Workspace } from "@mott/db/schema";
import { UpdateWorkspaceSchema } from "@mott/validators";

import { deleteFile } from "../lib/storage/s3/utils";
import { getCurrentWorkspace } from "../lib/workspace/workspace";
import { protectedProcedure } from "../trpc";

export const workspaceRouter = {
  get: protectedProcedure.query(async ({ ctx }) => {
    const workspace = await db.query.Workspace.findFirst({
      where: eq(Workspace.ownerId, ctx.session.user.id),
    });
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    return workspace;
  }),
  setLogo: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const workspace = await getCurrentWorkspace(ctx.session.user.id);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Delete old logo file if exists
      if (workspace.settings?.branding.logoFileId) {
        const oldFile = await db.query.File.findFirst({
          where: eq(File.id, workspace.settings.branding.logoFileId),
        });

        if (oldFile) {
          // Delete from S3
          await deleteFile(oldFile.path);
          // Delete from database
          await db.delete(File).where(eq(File.id, oldFile.id));
        }
      }

      const file = await db
        .insert(File)
        .values({
          name: input.name,
          mimeType: input.type,
          path: input.key,
          size: input.size,
          uploadedBy: ctx.session.user.id,
          workspaceId: workspace.id,
        })
        .returning();

      if (!file[0]) {
        throw new Error("File not created");
      }

      return await db
        .update(Workspace)
        .set({
          settings: {
            ...workspace.settings,
            branding: {
              ...workspace.settings?.branding,
              logoFileId: file[0].id,
            },
          },
        })
        .where(eq(Workspace.ownerId, ctx.session.user.id));
    }),
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
                  assistant: {
                    ...workspace.settings?.branding.assistant,
                    ...input.settings.branding?.assistant,
                  },
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
