import { env } from "../config/env";

import type { CalculationResultMessage } from "../types/CalculationResultMessage";

export class ResultModifierService {
  public modify(
    message: CalculationResultMessage
  ): CalculationResultMessage {
    return {
      ...message,

      result: Number(
        message.result.toFixed(
          env.RESULT_DECIMAL_PRECISION
        )
      ),
    };
  }
}

export const resultModifierService =
  new ResultModifierService();