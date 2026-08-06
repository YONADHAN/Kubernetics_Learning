import { connectionManager } from "./ConnectionManager";

import { rabbitmqConfig } from "../config/rabbitmq";
import { logger } from "../config/logger";

import type { PublishMessage } from "../types/PublishMessage";

export class Publisher {
  public async publish<T>(
    payload: PublishMessage<T>
  ): Promise<void> {
    const channel =
      connectionManager.getChannel();

    const published = channel.publish(
      payload.exchange,
      payload.routingKey,
      Buffer.from(
        JSON.stringify(payload.message)
      ),
      {
        persistent:
          rabbitmqConfig.persistentMessages,

        correlationId:
          payload.correlationId,

        headers:
          payload.headers ?? {},
      }
    );

    if (!published) {
      throw new Error(
        "Failed to publish RabbitMQ message."
      );
    }

    logger.info({
      event: "rabbitmq.message.published",

      exchange: payload.exchange,

      routingKey:
        payload.routingKey,

      correlationId:
        payload.correlationId,
    });
  }
}

export const publisher =
  new Publisher();