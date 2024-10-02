import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { invalidateSessionToken } from "@mott/auth";

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
  generateOTP: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log(input);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // await saveOTPForEmail(input.email, otp);
      // await sendEmailWithOTP(input.email, otp);
      return { success: true, message: "OTP sent to the provided email" };
    }),
} satisfies TRPCRouterRecord;
