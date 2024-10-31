import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { eq } from "@mott/db";
import { AICustomInstructions, User } from "@mott/db/schema";
import { ProfileUpdateSchema } from "@mott/validators";

import { protectedProcedure } from "../trpc";

export const profileRouter = {
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.User.findFirst({
      where: eq(User.id, ctx.session.user.id),
      with: {
        customInstructions: {
          where: eq(AICustomInstructions.isActive, true),
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      name: user.name ?? "",
      jobRole: user.jobRole ?? "",
      instructions: user.customInstructions[0]?.instructions ?? "",
      knowledge: "",
    };
  }),
  update: protectedProcedure
    .input(ProfileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(User)
          .set({
            name: input.name,
            jobRole: input.jobRole,
          })
          .where(eq(User.id, ctx.session.user.id));

        if (input.instructions) {
          const existingInstruction =
            await tx.query.AICustomInstructions.findFirst({
              where: eq(AICustomInstructions.userId, ctx.session.user.id),
            });

          if (existingInstruction) {
            await tx
              .update(AICustomInstructions)
              .set({
                instructions: input.instructions,
                updatedAt: new Date(),
              })
              .where(eq(AICustomInstructions.id, existingInstruction.id));
          } else {
            await tx.insert(AICustomInstructions).values({
              userId: ctx.session.user.id,
              instructions: input.instructions,
              isActive: true,
            });
          }
        }
      });

      return {
        success: true,
        message: "Profile updated successfully",
        updatedFields: {
          name: input.name,
          jobRole: input.jobRole,
        },
      };
    }),
} satisfies TRPCRouterRecord;
