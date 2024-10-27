import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.string().default('development'),
    CLIENT_BIGQUERY_CREDENTIALS: z.string(),
    QDRANT_URL: z.string(),
    QDRANT_API_KEY: z.string(),
    MXBAI_API_KEY: z.string(),
    LANGFUSE_SECRET_KEY: z.string(),
    LANGFUSE_PUBLIC_KEY: z.string(),
    LANGFUSE_BASEURL: z.string(),
    CLIENT_POSTGRES_HOST: z.string(),
    CLIENT_POSTGRES_PORT: z.string(),
    CLIENT_POSTGRES_USER: z.string(),
    CLIENT_POSTGRES_PASSWORD: z.string(),
    CLIENT_POSTGRES_DB: z.string(),
    CHAT_HISTORY_DB_HOST: z.string(),
    CHAT_HISTORY_DB_PORT: z.number(),
    CHAT_HISTORY_DB_USER: z.string(),
    CHAT_HISTORY_DB_PASSWORD: z.string(),
    CHAT_HISTORY_DB_NAME: z.string(),
    AGENT_TYPE: z.string(),
    OPENAI_API_KEY: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    SHOW_ROUTES: z.boolean().default(false),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  skipValidation: true,
});
