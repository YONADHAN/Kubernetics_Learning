import { ApiError } from "../utils/ApiError";

import type { CalculationMessage } from "../types/CalculationMessage";
import type { CalculationResultMessage } from "../types/CalculationResultMessage";

export class DivisionService {
  public calculate(
    message: CalculationMessage
  ): CalculationResultMessage {
    const {
      firstNumber,
      secondNumber,
      correlationId,
    } = message;

    if (secondNumber === 0) {
      throw new ApiError(
        400,
        "Division by zero is not allowed."
      );
    }

    const result =
      firstNumber / secondNumber;

    return {
      success: true,
      result,
      cached: false,
      correlationId,
    };
  }
}

export const divisionService =
  new DivisionService();