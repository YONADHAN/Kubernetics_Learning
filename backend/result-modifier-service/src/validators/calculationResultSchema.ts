import { z } from "zod";

export const calculationResultSchema =
  z.object({
    success: z.boolean(),

    result: z.number(),

    cached: z.boolean(),

    correlationId: z.uuid(),
  });

export type CalculationResultDto =
  z.infer<
    typeof calculationResultSchema
  >;