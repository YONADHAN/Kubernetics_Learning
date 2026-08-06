export interface CalculationResponse {
  success: boolean;

  result: number;

  cached: boolean;

  correlationId: string;
}