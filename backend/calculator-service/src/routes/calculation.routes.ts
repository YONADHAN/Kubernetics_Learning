import { Router } from "express";

import { calculatorController } from "../controllers/CalculatorController";

const router = Router();

router.post(
  "/calculate",
  calculatorController.calculate.bind(
    calculatorController
  )
);

export default router;