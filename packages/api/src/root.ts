import { attachmentsRouter } from "./router/attachments";
import { authRouter } from "./router/auth";
import { profileRouter } from "./router/profile";
import { workspaceRouter } from "./router/workspace";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  attachments: attachmentsRouter,
  auth: authRouter,
  profile: profileRouter,
  workspace: workspaceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
