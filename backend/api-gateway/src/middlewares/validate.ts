import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type { ZodSchema } from "zod";

import { ApiError } from "../utils/ApiError";

export function validate<T>(schema: ZodSchema<T>) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new ApiError(
          400,
          "Validation Failed",
          result.error.flatten()
        )
      );

      return;
    }

    req.body = result.data;

    next();
  };
}