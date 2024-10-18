import { Langfuse } from "langfuse";
import CallbackHandler from "langfuse-langchain";

import { env } from "~/env";

const langfuseParams = {
  publicKey: env.LANGFUSE_PUBLIC_KEY,
  secretKey: env.LANGFUSE_SECRET_KEY,
  baseUrl: env.LANGFUSE_BASEURL,
};
export const langfuse = new Langfuse(langfuseParams);

export function createCallbackHandler(params: {
  sessionId: string;
  userId: string;
}) {
  return new CallbackHandler({ ...langfuseParams, ...params });
}
