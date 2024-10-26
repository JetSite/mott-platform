import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { handleError, handleZodError } from "../libs/errors";
import { chatApi } from "./chat";

export const api = new OpenAPIHono({
  defaultHook: handleZodError,
});

api.onError(handleError);

api.use("/openapi", cors());

api.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "acme API",
  },
});

api.get(
  "/ui",
  apiReference({
    spec: {
      url: "/openapi",
    },
  })
);

api.use("/*", logger());
api.route("/chat", chatApi);
