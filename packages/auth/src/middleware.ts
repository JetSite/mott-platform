import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { env } from "../env";

const authConfig = {
  secret: env.AUTH_SECRET,
  providers: [Google],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;

export const { auth: middleware } = NextAuth(authConfig);
