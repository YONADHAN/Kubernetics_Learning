import { z } from "zod";

export const storeCacheSchema = z.object({
  key: z.string().min(1),

  value: z.unknown(),

  ttlInSeconds: z
    .number()
    .positive()
    .optional(),
});

export type StoreCacheDto =
  z.infer<typeof storeCacheSchema>;