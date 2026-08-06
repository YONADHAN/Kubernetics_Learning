import type { ZodSchema } from "zod";

export interface ConsumeMessage<T = unknown> {
  queue: string;
  schema?: ZodSchema<T>;
  handler: (
    message: T,
    correlationId?: string
  ) => Promise<void>;
}