import { Options } from "amqplib";

import { connectionManager } from "./ConnectionManager";
import { logger } from "../config/logger";

import type { PublishMessage } from "./types/PublishMessage";

export class Publisher {
  public async publish<T>(
    payload: PublishMessage<T>
  ): Promise<void> {
    const channel = connectionManager.getChannel();

    const messageBuffer = Buffer.from(
      JSON.stringify(payload.message)
    );

    const options: Options.Publish = {
      persistent: true,

      contentType: "application/json",

      correlationId: payload.correlationId,

      headers: payload.headers,
    };

    const published = channel.publish(
      payload.exchange,
      payload.routingKey,
      messageBuffer,
      options
    );

    if (!published) {
      throw new Error(
        "Failed to publish message."
      );
    }

    logger.info({
      event: "rabbitmq.message.published",

      exchange: payload.exchange,

      routingKey: payload.routingKey,

      correlationId: payload.correlationId,
    });
  }
}

export const publisher = new Publisher();