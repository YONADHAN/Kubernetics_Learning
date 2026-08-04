import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { calculatorServiceClient } from "../services/CalculatorServiceClient";
import type {
  CalculationRequest,
} from "../types/calculator";

export class CalculatorController {
  public async calculate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as CalculationRequest;

      const result =
        await calculatorServiceClient.calculate(payload);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const calculatorController =
  new CalculatorController();