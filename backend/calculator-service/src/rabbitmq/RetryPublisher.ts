import { publisher } from "./Publisher";

import { rabbitmqConfig } from "../config/rabbitmq";
import { logger } from "../config/logger";

import type { PublishMessage } from "./types/PublishMessage";

export class RetryPublisher {
  public async publish<T>(
    payload: PublishMessage<T>
  ): Promise<void> {
    let attempt = 1;

    let delay =
      rabbitmqConfig.initialBackoffMs;

    while (
      attempt <=
      rabbitmqConfig.publishMaxRetries
    ) {
      try {
        await publisher.publish(payload);

        logger.info({
          event: "rabbitmq.publish.success",

          exchange: payload.exchange,

          routingKey: payload.routingKey,

          attempt,
        });

        return;
      } catch (error) {
        logger.warn({
          event: "rabbitmq.publish.retry",

          exchange: payload.exchange,

          routingKey: payload.routingKey,

          attempt,

          delay,

          error:
            error instanceof Error
              ? error.message
              : "Unknown error",
        });

        if (
          attempt ===
          rabbitmqConfig.publishMaxRetries
        ) {
          logger.error({
            event:
              "rabbitmq.publish.failed",

            exchange: payload.exchange,

            routingKey: payload.routingKey,
          });

          throw error;
        }

        await this.delay(delay);

        delay *= 2;

        attempt++;
      }
    }
  }

  private delay(
    milliseconds: number
  ): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(resolve, milliseconds)
    );
  }
}

export const retryPublisher =
  new RetryPublisher();