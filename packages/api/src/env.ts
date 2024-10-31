import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    STORAGE_ENDPOINT_URL: z.string(),
    STORAGE_ACCESS_KEY_ID: z.string(),
    STORAGE_SECRET_ACCESS_KEY: z.string(),
    STORAGE_BUCKET_NAME: z.string(),
    STORAGE_REGION: z.string(),
  },
  runtimeEnv: process.env,
});
