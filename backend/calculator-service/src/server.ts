import app from "./app";

import { env } from "./config/env";
import { logger } from "./config/logger";

import { connectionManager } from "./rabbitmq/ConnectionManager";
import { resultConsumer } from "./rabbitmq/ResultConsumer";

class Server {
  public async start(): Promise<void> {
    try {
      /**
       * Connect RabbitMQ
       */
      await connectionManager.connect();

      /**
       * Start RabbitMQ consumers
       */
      await resultConsumer.start();

      /**
       * Start HTTP Server
       */
      app.listen(env.PORT, () => {
        logger.info({
          event: "server.started",
          port: env.PORT,
          service: env.SERVICE_NAME,
        });
      });

      this.registerShutdownHandlers();
    } catch (error) {
      logger.fatal({
        event: "server.start.failed",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });

      process.exit(1);
    }
  }

  private registerShutdownHandlers(): void {
    const shutdown = async (
      signal: string
    ): Promise<void> => {
      logger.info({
        event: "server.shutdown",
        signal,
      });

      await connectionManager.close();

      process.exit(0);
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  }
}

const server = new Server();

void server.start();