import {
  Message,
} from "amqplib";

import { connectionManager } from "./ConnectionManager";

import { logger } from "../config/logger";

import type { ConsumeMessage as ConsumerOptions } from "./types/ConsumeMessage";

export class Consumer {
  public async consume<T>(
    options: ConsumerOptions<T>
  ): Promise<void> {
    const channel =
      connectionManager.getChannel();

    await channel.consume(
      options.queue,

      async (message: Message | null) => {
        if (!message) {
          return;
        }

        try {
          const payload = JSON.parse(
            message.content.toString()
          ) as T;

          await options.handler(
            payload,
            message.properties.correlationId
          );

          channel.ack(message);

          logger.info({
            event: "rabbitmq.message.ack",

            queue: options.queue,

            correlationId:
              message.properties.correlationId,
          });
        } catch (error) {
          logger.error({
            event: "rabbitmq.message.failed",

            queue: options.queue,

            correlationId:
              message.properties.correlationId,

            error:
              error instanceof Error
                ? error.message
                : "Unknown error",
          });

          channel.nack(
            message,
            false,
            false
          );
        }
      }
    );

    logger.info({
      event: "rabbitmq.consumer.started",

      queue: options.queue,
    });
  }
}

export const consumer =
  new Consumer();