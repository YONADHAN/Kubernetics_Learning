import { z } from "zod";

export const calculationSchema = z.object({
  operation: z.enum([
    "add",
    "sub",
    "mul",
    "div",
  ]),

  a: z.number(),

  b: z.number(),
});

export type CalculationSchema = z.infer<
  typeof calculationSchema
>;