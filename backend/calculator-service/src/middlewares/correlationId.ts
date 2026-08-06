import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { v4 as uuid } from "uuid";

export function correlationId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId =
    req.header("x-correlation-id") ?? uuid();

  req.correlationId = correlationId;

  res.setHeader(
    "x-correlation-id",
    correlationId
  );

  next();
}