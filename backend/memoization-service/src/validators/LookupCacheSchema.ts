import { z } from "zod";

export const lookupCacheSchema = z.object({
  key: z.string().min(1, "Cache key is required"),
});