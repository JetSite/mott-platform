import { OpenAPIHono } from "@hono/zod-openapi";

import { handleZodError } from "../../libs/errors";
import { registerChatPost } from "./post";
export const chatApi = new OpenAPIHono({
  defaultHook: handleZodError,
});

registerChatPost(chatApi);
