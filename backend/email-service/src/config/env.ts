import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  /**
   * Application
   */
  PORT: z.coerce.number().positive(),

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

  /**
   * RabbitMQ
   */
  RABBITMQ_URL: z.string().url(),

  RABBITMQ_PREFETCH_COUNT: z.coerce
    .number()
    .positive(),

  RABBITMQ_RECONNECT_DELAY_MS:
    z.coerce.number().positive(),

  /**
   * SMTP
   */
  MAIL_HOST: z.string().min(1),

  MAIL_PORT: z.coerce.number().positive(),

  MAIL_SECURE: z.coerce.boolean(),

  MAIL_USER: z.string().email(),

  MAIL_PASSWORD: z.string().min(1),

  MAIL_FROM: z.string().min(1),

  MAIL_TO: z.string().email(),

  /**
   * Inbox Pattern
   */
  REDIS_URL: z.string().url(),
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