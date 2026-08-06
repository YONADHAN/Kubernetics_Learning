export interface CalculationResultMessage {
  success: boolean;

  result: number;

  cached: boolean;

  correlationId: string;
}