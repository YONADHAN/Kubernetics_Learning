import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type { ZodSchema } from "zod";

import { ApiError } from "../shared/utils/ApiError";
type ValidationTarget =
  | "body"
  | "query"
  | "params";

export function validate<T>(
  schema: ZodSchema<T>,
  target: ValidationTarget = "body"
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(
      req[target]
    );

    if (!result.success) {
      next(
        new ApiError(
          400,
          "Validation failed",
          result.error.flatten()
        )
      );

      return;
    }

    req[target] = result.data as typeof req[typeof target];

    next();
  };
}