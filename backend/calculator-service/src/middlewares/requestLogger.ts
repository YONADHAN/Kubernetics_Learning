import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { logger } from "../config/logger";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  logger.info({
    event: "http.request",
    correlationId: req.correlationId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;

    logger.info({
      event: "http.response",
      correlationId: req.correlationId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs,
      contentLength: res.getHeader("content-length"),
    });
  });

  next();
}