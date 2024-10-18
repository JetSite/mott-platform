import { createRoute, z } from "@hono/zod-openapi";

import type { chatApi } from "./index";
import { runChatWithSqlAgent } from "~/lib/llm/utils";
import { openApiErrorResponses } from "~/libs/errors/openapi-error-responses";

const postRoute = createRoute({
  method: "post",
  tags: ["chat"],
  description: "Create a chat message",
  path: "/",
  request: {
    body: {
      description: "The chat message to create",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            response: z.string(),
          }),
        },
      },
      description: "Get a chat response",
    },
    ...openApiErrorResponses,
  },
});

export function registerChatPost(api: typeof chatApi) {
  return api.openapi(postRoute, async (c) => {
    const { message } = await c.req.json();
    const response = await runChatWithSqlAgent(message, "");
    return c.json({ response }, 200);
  });
}