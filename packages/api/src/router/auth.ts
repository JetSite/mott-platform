import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";

import { invalidateSessionToken } from "@mott/auth";
import { OnboardingData } from "@mott/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
  checkOnboardingStatus: protectedProcedure.mutation(async ({ ctx }) => {
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
} satisfies TRPCRouterRecord;
