import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().optional(),
    MAILDEV_ENABLED: z.string().optional(),
    MAILDEV_HOST: z.string().optional(),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MAILDEV_ENABLED: process.env.MAILDEV_ENABLED,
    MAILDEV_HOST: process.env.MAILDEV_HOST,
  },
});
