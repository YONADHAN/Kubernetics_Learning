import app from "./app";

import { env } from "./config/env";
import { logger } from "./config/logger";

import { connectionManager } from "./rabbitmq/ConnectionManager";

import { emailWorker } from "./workers/EmailWorker";

async function bootstrap(): Promise<void> {
  try {
    /**
     * RabbitMQ
     */
    await connectionManager.connect();

    /**
     * Start Email Worker
     */
    await emailWorker.start();

    /**
     * Health Server
     */
    app.listen(env.PORT, () => {
      logger.info({
        event: "http.server.started",
        service: env.SERVICE_NAME,
        port: env.PORT,
      });
    });

    logger.info({
      event: "email.service.started",
    });
  } catch (error) {
    logger.fatal({
      event: "application.start.failed",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    process.exit(1);
  }
}

void bootstrap();