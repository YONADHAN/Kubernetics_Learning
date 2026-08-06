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
  private connection: ChannelModel | null = null;

  private channel: Channel | null = null;

  public async connect(): Promise<void> {
    try {
      logger.info({
        event: "rabbitmq.connecting",
      });

      this.connection = await amqp.connect(
        rabbitmqConfig.url
      );

      this.registerConnectionEvents();

      this.channel =
        await this.connection.createChannel();

      await this.channel.prefetch(
        rabbitmqConfig.prefetchCount
      );

      await this.initializeTopology();

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

  private registerConnectionEvents(): void {
    if (!this.connection) return;

    this.connection.on("close", () => {
      logger.warn({
        event: "rabbitmq.connection.closed",
      });

      this.connection = null;
      this.channel = null;

      this.reconnect();
    });

    this.connection.on("error", (error) => {
      logger.error({
        event: "rabbitmq.connection.error",
        error: error.message,
      });
    });
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
      "direct",
      { durable: true }
    );

    await this.channel.assertExchange(
      Exchanges.RESULT_RAW,
      "direct",
      { durable: true }
    );

    await this.channel.assertExchange(
      Exchanges.RESULT_FINAL,
      "direct",
      { durable: true }
    );

    await this.channel.assertExchange(
      Exchanges.DEAD_LETTER,
      "direct",
      { durable: true }
    );
  }

  private async assertQueues(): Promise<void> {
    if (!this.channel) return;

    await this.channel.assertQueue(
      Queues.ADDITION,
      {
        durable: true,
      }
    );

    await this.channel.assertQueue(
      Queues.SUBTRACTION,
      {
        durable: true,
      }
    );

    await this.channel.assertQueue(
      Queues.MULTIPLICATION,
      {
        durable: true,
      }
    );

    await this.channel.assertQueue(
      Queues.DIVISION,
      {
        durable: true,
      }
    );

    await this.channel.assertQueue(
      Queues.RESULT_RAW,
      {
        durable: true,
      }
    );

    await this.channel.assertQueue(
      Queues.RESULT_FINAL,
      {
        durable: true,
      }
    );

    await this.channel.assertQueue(
      Queues.DEAD_LETTER,
      {
        durable: true,
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
        "RabbitMQ channel is not initialized."
      );
    }

    return this.channel;
  }

  public isConnected(): boolean {
    return (
      this.connection !== null &&
      this.channel !== null
    );
  }

  public async close(): Promise<void> {
    try {
      await this.channel?.close();

      await this.connection?.close();

      logger.info({
        event: "rabbitmq.connection.closed",
      });
    } catch (error) {
      logger.error({
        event: "rabbitmq.connection.close.failed",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }

  private reconnect(): void {
    logger.info({
      event: "rabbitmq.reconnecting",
      delay: rabbitmqConfig.reconnectDelayMs,
    });

    setTimeout(() => {
      void this.connect();
    }, rabbitmqConfig.reconnectDelayMs);
  }
}

export const connectionManager =
  new ConnectionManager();