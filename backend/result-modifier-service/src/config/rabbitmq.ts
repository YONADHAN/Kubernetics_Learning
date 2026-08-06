import { env } from "./env";

export const rabbitmqConfig = {
  /**
   * RabbitMQ Connection URL
   */
  url: env.RABBITMQ_URL,

  /**
   * Number of unacknowledged messages
   * the consumer can process at a time.
   */
  prefetchCount:
    env.RABBITMQ_PREFETCH_COUNT,

  /**
   * Delay before reconnecting
   * after a connection failure.
   */
  reconnectDelayMs:
    env.RABBITMQ_RECONNECT_DELAY_MS,

  /**
   * Exchange Type
   */
  exchangeType: "direct" as const,

  /**
   * Durable exchanges & queues
   */
  durable: true,

  /**
   * Publish persistent messages
   */
  persistentMessages: true,
} as const;