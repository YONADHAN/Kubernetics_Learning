import { z } from "zod";

export const calculationMessageSchema =
  z.object({
    operation: z.enum([
      "add",
      "sub",
      "mul",
      "div",
    ]),

    firstNumber: z.number(),

    secondNumber: z.number(),

    correlationId: z.uuid(),
  });

export type CalculationMessageDto =
  z.infer<
    typeof calculationMessageSchema
  >;