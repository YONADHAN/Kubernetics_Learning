import express from "express";
import cors from "cors";
import helmet from "helmet";

import calculationRoutes from "./routes/calculation.routes";
import healthRoutes from "./routes/health.routes";

import { correlationId } from "./middlewares/correlationId";
import { requestLogger } from "./middlewares/requestLogger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

export class App {
  private readonly app = express();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());

    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(correlationId);

    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    this.app.use("/api/v1", calculationRoutes);

    this.app.use("/", healthRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFound);

    this.app.use(errorHandler);
  }

  public getApp() {
    return this.app;
  }
}