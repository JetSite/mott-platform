import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { api } from "../api";
import { extendZodWithOpenApi } from "@hono/zod-openapi";
import { z } from "zod";
const app = new Hono();
extendZodWithOpenApi(z);

app.use("/ping", logger());
app.get("/ping", (c) => c.json({ ping: "pong" }, 200));
app.route("/", api);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const isDev = process.env.NODE_ENV === "development";
const port = 8000;

if (isDev) showRoutes(app, { verbose: true, colorize: true });

console.log(`Starting server on port ${port}`);

const server = { port, fetch: app.fetch };

export default server;
