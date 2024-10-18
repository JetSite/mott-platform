import { extendZodWithOpenApi, z } from "@hono/zod-openapi";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";

import { api } from "./api";
import { env } from "./env";
import { handleError } from "./libs/errors";

extendZodWithOpenApi(z);

const app = new Hono({ strict: false });
app.onError(handleError);

/**
 * Public Routes
 */

/**
 * Ping Pong
 */
app.use("/ping", logger());
app.get("/ping", (c) => c.json({ ping: "pong" }, 200));
app.route("/", api);

const isDev = env.NODE_ENV === "development";
const port = 8000;

if (isDev) showRoutes(app, { verbose: true, colorize: true });

console.log(`Starting server on port ${port}`);

const server = { port, fetch: app.fetch };

export default server;
