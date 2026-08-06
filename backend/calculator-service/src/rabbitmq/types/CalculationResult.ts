export interface CalculationResult {
  success: boolean;

  result: number;

  cached: boolean;

  correlationId: string;
}