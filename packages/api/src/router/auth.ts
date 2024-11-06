import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { invalidateSessionToken } from "@mott/auth";
import { CorporateChat, OnboardingData, User } from "@mott/db/schema";

import { createWorkspace } from "../lib/workspace/workspace";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  checkOnboardingStatus: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.User.findFirst({
      where: eq(User.id, ctx.session.user.id),
      columns: {
        name: true,
      },
    });
    if (!user?.name) {
      return {
        completed: false,
        currentStep: "full_name",
        stepDescription: "Fill in your full name",
      };
    }
    const onboardingData = await ctx.db.query.OnboardingData.findFirst({
      where: eq(OnboardingData.userId, ctx.session.user.id),
      columns: {
        companyName: true,
        companyWebsite: true,
        corporateChat: true,
      },
    });

    if (!onboardingData) {
      return {
        completed: false,
        currentStep: "welcome",
        stepDescription: "Welcome to the onboarding process",
      };
    }

    let currentStep = "company_name";
    let stepDescription = "Fill in your company name";

    if (!onboardingData.companyName || !onboardingData.companyWebsite) {
      currentStep = "company_name";
      stepDescription = "Fill in your company name";
    } else if (!onboardingData.corporateChat) {
      currentStep = "corporate_chat";
      stepDescription = "Set your corporate chat";
    }

    return {
      completed: false,
      currentStep,
      stepDescription,
    };
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  setUserName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(User)
        .set({ name: input.name })
        .where(eq(User.id, ctx.session.user.id));

      return { success: true };
    }),
  saveCompanyInfo: protectedProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        companyWebsite: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(OnboardingData)
        .values({
          userId: ctx.session.user.id,
          companyName: input.companyName,
          companyWebsite: input.companyWebsite,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: OnboardingData.id,
          set: {
            companyName: input.companyName,
            companyWebsite: input.companyWebsite,
            updatedAt: new Date(),
          },
        });
      await createWorkspace(input.companyName, ctx.session.user.id);

      return { success: true };
    }),
  saveCorporateChat: protectedProcedure
    .input(z.object({ corporateChat: z.nativeEnum(CorporateChat) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(OnboardingData)
        .set({
          corporateChat: input.corporateChat,
          updatedAt: new Date(),
        })
        .where(eq(OnboardingData.userId, ctx.session.user.id));

      return { success: true };
    }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
