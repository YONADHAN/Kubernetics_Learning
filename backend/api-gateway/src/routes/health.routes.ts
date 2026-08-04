import { Router } from "express";

import { healthController } from "../controllers/HealthController";

const router = Router();

router.get(
  "/health",
  healthController.health.bind(healthController)
);

export default router;