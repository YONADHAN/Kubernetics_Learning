import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { logger } from "../config/logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ApiError) {
    logger.warn({
      event: "application.error",
      correlationId: req.correlationId,
      method: req.method,
      url: req.originalUrl,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      correlationId: req.correlationId,
      details: error.details ?? null,
    });

    return;
  }

  logger.error({
    event: "internal.error",
    correlationId: req.correlationId,
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message,
    statusCode: 500,
    correlationId: req.correlationId,
    stack:
      env.NODE_ENV === "development"
        ? error.stack
        : undefined,
  });
}