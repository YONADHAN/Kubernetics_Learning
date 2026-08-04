export type Operation =
  | "add"
  | "sub"
  | "mul"
  | "div";

export interface CalculationRequest {
  operation: Operation;
  a: number;
  b: number;
}

export interface CalculationResponse {
  success: boolean;
  result: number;
  cached: boolean;
  correlationId: string;
}