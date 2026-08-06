import express from "express";

import healthRoutes from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use("/api/v1", healthRoutes);

export default app;