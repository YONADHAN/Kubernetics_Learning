import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  SERVICE_NAME: z.string().min(1),

  LOG_LEVEL: z.enum([
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
  ]),

  RABBITMQ_URL: z.string().min(1),

  RABBITMQ_RECONNECT_DELAY_MS: z.coerce.number().positive(),

  RABBITMQ_PREFETCH_COUNT: z.coerce.number().positive(),

  RABBITMQ_PUBLISH_MAX_RETRIES: z.coerce.number().positive(),

  RABBITMQ_INITIAL_BACKOFF_MS: z.coerce.number().positive(),

  MEMOIZATION_SERVICE_URL: z.string().url(),

  REQUEST_TIMEOUT: z.coerce.number().positive(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;