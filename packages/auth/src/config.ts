import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { eq } from "@mott/db";
import { db } from "@mott/db/client";
import { Account, Session, User, VerificationToken } from "@mott/db/schema";
import { OtpSignInEmail, sendEmail } from "@mott/emails";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: User,
  accountsTable: Account,
  sessionsTable: Session,
  verificationTokensTable: VerificationToken,
});

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
  adapter,
  debug: env.NODE_ENV === "development",
  secret: env.AUTH_SECRET,
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      from: "hi@mott.ai",
      apiKey: env.RESEND_API_KEY,
      generateVerificationToken: () => {
        // Generate a random 6-digit code (OTP)
        return Math.floor(
          Math.random() * (999999 - 100000 + 1) + 100000,
        ).toString();
      },
      sendVerificationRequest: async ({ identifier, token }) => {
        const user = await db.query.User.findFirst({
          where: eq(User.email, identifier),
          columns: {
            emailVerified: true,
          },
        });
        const sendTitle = user ? "Sign in" : "Sign up";
        await sendEmail({
          to: [identifier],
          subject: `OTP - ${sendTitle}`,
          react: OtpSignInEmail({ otp: token, isSignUp: !user }),
          from: "hi@mott.ai",
        });
      },
    }),
  ],
  callbacks: {
    session: (opts) => {
      if (!("user" in opts)) {
        throw new Error("unreachable with session strategy");
      }

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
