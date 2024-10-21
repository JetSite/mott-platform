import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@mott/db/client";
import { Account, Session, User, VerificationToken } from "@mott/db/schema";

import { env } from "../env";

const adapter = DrizzleAdapter(db, {
  usersTable: User,
  accountsTable: Account,
  sessionsTable: Session,
  verificationTokensTable: VerificationToken,
});

const authConfig = {
  adapter,
  secret: env.AUTH_SECRET,
  providers: [Google],
} satisfies NextAuthConfig;

export const { auth: middleware } = NextAuth(authConfig);
