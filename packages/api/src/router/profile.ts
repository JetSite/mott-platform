import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@mott/db";
import { User } from "@mott/db/schema";
import { ProfileUpdateSchema } from "@mott/validators";

import { protectedProcedure } from "../trpc";

export const profileRouter = {
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.User.findFirst({
      where: eq(User.id, ctx.session.user.id),
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      name: user.name ?? "",
      role: user.role ?? "",
      instructions: "",
      knowledge: "",
    };
  }),
  update: protectedProcedure
    .input(ProfileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(User)
        .set({
          name: input.name,
          role: input.role,
        })
        .where(eq(User.id, ctx.session.user.id));

      return { success: true };
    }),
} satisfies TRPCRouterRecord;
