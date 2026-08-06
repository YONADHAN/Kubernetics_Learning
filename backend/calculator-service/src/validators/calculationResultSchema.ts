import { z } from "zod";

export const calculationResultSchema = z.object({
  success: z.boolean(),

  result: z.number(),

  cached: z.boolean(),

  correlationId: z.string().uuid(),
});

export type CalculationResult =
  z.infer<typeof calculationResultSchema>;