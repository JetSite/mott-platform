// src/middleware/validationErrorMiddleware.ts

import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

import type { ValidationErrorItem } from "../lib/errors/validation-error";
import { ValidationError } from "../lib/errors/validation-error";

export function validationErrorMiddleware(error: unknown): unknown {
  if (error instanceof ZodError) {
    const errors: ValidationErrorItem[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return new TRPCError({
      code: "BAD_REQUEST",
      message: "Validation error",
      cause: new ValidationError(errors),
    });
  }
  return error;
}
