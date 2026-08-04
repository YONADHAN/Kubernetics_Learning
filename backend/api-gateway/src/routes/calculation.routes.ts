import { Router } from "express";

import { calculatorController } from "../controllers/CalculatorController";
import { validate } from "../middlewares/validate";
import { calculationSchema } from "../validators/calculationSchema";

const router = Router();

router.post(
  "/calculate",
  validate(calculationSchema),
  calculatorController.calculate.bind(
    calculatorController
  )
);

export default router;