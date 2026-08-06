import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().positive(),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  SERVICE_NAME: z.string().min(1),

  REDIS_URL: z.string().url(),

  LOG_LEVEL: z.enum([
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
  ]),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;