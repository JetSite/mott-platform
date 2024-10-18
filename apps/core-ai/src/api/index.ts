import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { handleError, handleZodError } from "../libs/errors";
import { middleware } from "./middleware";

export const api = new OpenAPIHono({
  defaultHook: handleZodError,
});

api.onError(handleError);

api.use("/openapi", cors());

api.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "OpenStatus API",
  },
});

api.get(
  "/",
  apiReference({
    spec: {
      url: "/openapi",
    },
  }),
);
/**
 * Authentification Middleware
 */
api.use("/*", middleware);
api.use("/*", logger());
