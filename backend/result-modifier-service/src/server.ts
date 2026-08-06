import app from "./app";

import { env } from "./config/env";
import { logger } from "./config/logger";

import { connectionManager } from "./rabbitmq/ConnectionManager";

import { resultModifierWorker } from "./workers/ResultModifierWorker";

async function bootstrap(): Promise<void> {
  try {
    /**
     * Connect RabbitMQ
     */
    await connectionManager.connect();

    /**
     * Start Worker
     */
    await resultModifierWorker.start();

    /**
     * Health Server
     */
    app.listen(env.PORT, () => {
      logger.info({
        event: "http.server.started",
        port: env.PORT,
        service: env.SERVICE_NAME,
      });
    });

    logger.info({
      event: "result.modifier.started",
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