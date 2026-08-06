import app from "./app";

import { env } from "./config/env";
import { logger } from "./config/logger";

import { connectionManager } from "./rabbitmq/ConnectionManager";
import { divisionWorker } from "./workers/DivisionWorker";

async function bootstrap(): Promise<void> {
  try {
    await connectionManager.connect();

    await divisionWorker.start();

    app.listen(env.PORT, () => {
      logger.info({
        event: "division.http.started",
        port: env.PORT,
      });
    });

    logger.info({
      event: "division.worker.started",
      service: env.SERVICE_NAME,
    });
  } catch (error) {
    logger.fatal({
      event: "division.start.failed",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    process.exit(1);
  }
}

void bootstrap();