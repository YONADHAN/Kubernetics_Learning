import type {
  Request,
  Response,
} from "express";

export class HealthController {
  public health(
    _req: Request,
    res: Response
  ): void {
    res.status(200).json({
      success: true,
      service: "api-gateway",
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  }
}

export const healthController =
  new HealthController();