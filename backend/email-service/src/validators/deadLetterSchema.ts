import { z } from "zod";

export const deadLetterSchema = z.object({
  correlationId: z.uuid(),

  service: z.string().min(1),

  exchange: z.string().min(1),

  routingKey: z.string().min(1),

  payload: z.unknown(),

  reason: z.string().min(1),

  failedAt: z.iso.datetime(),
});

export type DeadLetterMessageDto =
  z.infer<typeof deadLetterSchema>;