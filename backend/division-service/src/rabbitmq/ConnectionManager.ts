import amqp, {
  Channel,
  ChannelModel,
} from "amqplib";

import { rabbitmqConfig } from "../config/rabbitmq";
import { logger } from "../config/logger";

import { Exchanges } from "./topology/exchanges";
import { Queues } from "./topology/queues";
import { Bindings } from "./topology/bindings";

export class ConnectionManager {
  private connection: ChannelModel | null =
    null;

  private channel: Channel | null = null;

  public async connect(): Promise<void> {
    try {
      logger.info({
        event: "rabbitmq.connecting",
      });

      this.connection = await amqp.connect(
        rabbitmqConfig.url
      );

      this.connection.on("close", () => {
        logger.warn({
          event: "rabbitmq.connection.closed",
        });

        this.reconnect();
      });

      this.connection.on("error", (error) => {
        logger.error({
          event: "rabbitmq.connection.error",
          error: error.message,
        });
      });

      this.channel =
        await this.connection.createChannel();

      await this.initializeTopology();

      await this.channel.prefetch(
        rabbitmqConfig.prefetchCount
      );

      logger.info({
        event: "rabbitmq.connected",
      });
    } catch (error) {
      logger.error({
        event: "rabbitmq.connection.failed",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });

      this.reconnect();
    }
  }

  private async initializeTopology(): Promise<void> {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel not initialized."
      );
    }

    await this.assertExchanges();

    await this.assertQueues();

    await this.bindQueues();
  }

  private async assertExchanges(): Promise<void> {
    if (!this.channel) return;

    await this.channel.assertExchange(
      Exchanges.CALCULATION,
      rabbitmqConfig.exchangeType,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertExchange(
      Exchanges.RESULT_RAW,
      rabbitmqConfig.exchangeType,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertExchange(
      Exchanges.RESULT_FINAL,
      rabbitmqConfig.exchangeType,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertExchange(
      Exchanges.DEAD_LETTER,
      rabbitmqConfig.exchangeType,
      {
        durable: rabbitmqConfig.durable,
      }
    );
  }

  private async assertQueues(): Promise<void> {
    if (!this.channel) return;

    await this.channel.assertQueue(
      Queues.ADDITION,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertQueue(
      Queues.SUBTRACTION,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertQueue(
      Queues.MULTIPLICATION,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertQueue(
      Queues.DIVISION,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertQueue(
      Queues.RESULT_RAW,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertQueue(
      Queues.RESULT_FINAL,
      {
        durable: rabbitmqConfig.durable,
      }
    );

    await this.channel.assertQueue(
      Queues.DEAD_LETTER,
      {
        durable: rabbitmqConfig.durable,
      }
    );
  }

  private async bindQueues(): Promise<void> {
    if (!this.channel) return;

    for (const binding of Bindings) {
      await this.channel.bindQueue(
        binding.queue,
        binding.exchange,
        binding.routingKey
      );
    }
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel has not been initialized."
      );
    }

    return this.channel;
  }

  public async close(): Promise<void> {
    await this.channel?.close();

    await this.connection?.close();

    logger.info({
      event: "rabbitmq.closed",
    });
  }

  private reconnect(): void {
    logger.info({
      event: "rabbitmq.reconnecting",
      delay:
        rabbitmqConfig.reconnectDelayMs,
    });

    setTimeout(() => {
      void this.connect();
    }, rabbitmqConfig.reconnectDelayMs);
  }
}

export const connectionManager =
  new ConnectionManager();