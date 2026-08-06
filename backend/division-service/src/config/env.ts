import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.number,

  SERVICE_NAME: z.string().min(1),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  LOG_LEVEL: z.enum([
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
  ]),

  RABBITMQ_URL: z.string().url(),

  RABBITMQ_PREFETCH_COUNT: z.coerce
    .number()
    .positive(),

  RABBITMQ_RECONNECT_DELAY_MS:
    z.coerce.number().positive(),
});

const parsed = envSchema.safeParse(
  process.env
);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:"
  );

  console.error(parsed.error.format());

  process.exit(1);
}

export const env = parsed.data;