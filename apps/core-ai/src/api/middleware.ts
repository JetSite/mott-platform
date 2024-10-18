import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

import { env } from "../env";

function verifyKey(key: string): {
  result: { valid: boolean; ownerId: string };
  error: Error | null;
} {
  return { result: { valid: true, ownerId: "1" }, error: null };
}

export async function middleware(c: Context, next: Next) {
  const key = c.req.header("x-mott-key");
  if (!key) throw new HTTPException(401, { message: "Unauthorized" });

  const { error, result } =
    env.NODE_ENV === "production"
      ? await verifyKey(key)
      : { result: { valid: true, ownerId: "1" }, error: null };

  if (error) throw new HTTPException(500, { message: error.message });
  if (!result.valid) throw new HTTPException(401, { message: "Unauthorized" });
  if (!result.ownerId)
    throw new HTTPException(401, { message: "Unauthorized" });

  await next();
}
