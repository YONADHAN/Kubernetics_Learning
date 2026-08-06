import { env } from "./env";

export const rabbitmqConfig = {
  url: env.RABBITMQ_URL,

  reconnectDelayMs: env.RABBITMQ_RECONNECT_DELAY_MS,

  prefetchCount: env.RABBITMQ_PREFETCH_COUNT,

  publishMaxRetries: env.RABBITMQ_PUBLISH_MAX_RETRIES,

  initialBackoffMs: env.RABBITMQ_INITIAL_BACKOFF_MS,
} as const;