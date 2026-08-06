import express from "express";
import helmet from "helmet";
import cors from "cors";

import calculationRoutes from "./routes/calculation.routes";
import healthRoutes from "./routes/health.routes";

import { correlationId } from "./middlewares/correlationId";
import { requestLogger } from "./middlewares/requestLogger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

/**
 * Security
 */
app.use(helmet());

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Parse JSON body
 */
app.use(express.json());

/**
 * Correlation ID
 */
app.use(correlationId);

/**
 * Request Logging
 */
app.use(requestLogger);

/**
 * Routes
 */
app.use("/api/v1", healthRoutes);

app.use("/api/v1", calculationRoutes);

/**
 * 404 Handler
 */
app.use(notFound);

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;