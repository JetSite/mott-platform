import { attachmentsRouter } from "./router/attachments";
import { authRouter } from "./router/auth";
import { profileRouter } from "./router/profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  attachments: attachmentsRouter,
  auth: authRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
