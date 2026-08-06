import { env } from "./env";

export const rabbitmqConfig = {
  /**
   * RabbitMQ Connection URL
   */
  url: env.RABBITMQ_URL,

  /**
   * Number of messages a consumer
   * can process simultaneously.
   */
  prefetchCount:
    env.RABBITMQ_PREFETCH_COUNT,

  /**
   * Delay before attempting
   * reconnection.
   */
  reconnectDelayMs:
    env.RABBITMQ_RECONNECT_DELAY_MS,

  /**
   * Exchange Type
   */
  exchangeType: "direct" as const,

  /**
   * Durable Exchanges & Queues
   */
  durable: true,

  /**
   * Persistent Messages
   */
  persistentMessages: true,
} as const;