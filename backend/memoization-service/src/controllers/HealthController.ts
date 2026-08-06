import type {
  Request,
  Response,
} from "express";

import { env } from "../shared/config/env";

export class HealthController {
  public health(
    _req: Request,
    res: Response
  ): void {
    res.status(200).json({
      success: true,
      service: env.SERVICE_NAME,
      status: "UP",
      timestamp: new Date().toISOString(),
    });
  }
}

export const healthController =
  new HealthController();