import express from "express";
import helmet from "helmet";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import memoizationRoutes from "./routes/memoization.routes";

import { correlationId } from "./middlewares/correlationId";
import { requestLogger } from "./middlewares/requestLogger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(correlationId);
app.use(requestLogger);

app.use("/api/v1", healthRoutes);
app.use("/api/v1", memoizationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;