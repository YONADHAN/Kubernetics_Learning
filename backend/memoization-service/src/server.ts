import app from "./app";

import { env } from "./shared/config/env";
import { logger } from "./shared/config/logger";
import { redisClient } from "./shared/config/redis";

class Server {
  public async start(): Promise<void> {
    try {
      /**
       * Connect Redis
       */
      await redisClient.connect();

      /**
       * Start HTTP Server
       */
      app.listen(env.PORT, () => {
        logger.info({
          event: "server.started",
          service: env.SERVICE_NAME,
          port: env.PORT,
        });
      });

      this.registerShutdownHandlers();
    } catch (error) {
      logger.fatal({
        event: "server.failed",
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
    ) => {
      logger.info({
        event: "server.shutdown",
        signal,
      });

      await redisClient.disconnect();

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