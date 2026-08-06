import type { Request, Response, NextFunction } from "express";

import { calculatorService } from "../services/CalculatorService";

import type { CalculationRequest } from "../types/calculator/CalculationRequest";

export class CalculatorController {
  public async calculate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: CalculationRequest = {
        operation: req.body.operation,
        firstNumber: req.body.firstNumber,
        secondNumber: req.body.secondNumber,

        correlationId:
          req.headers["x-correlation-id"] as string,
      };

      const result =
        await calculatorService.calculate(request);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const calculatorController =
  new CalculatorController();