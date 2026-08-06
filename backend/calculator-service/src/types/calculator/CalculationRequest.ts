export interface CalculationRequest {
  operation: "add" | "sub" | "mul" | "div";

  firstNumber: number;

  secondNumber: number;

  correlationId: string;
}