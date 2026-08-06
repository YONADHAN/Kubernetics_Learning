import { consumer } from "./Consumer";

import { Queues } from "./topology/queues";

import { pendingRequestStore } from "./PendingRequestStore";

import { logger } from "../config/logger";

import type { CalculationResult } from "./types/CalculationResult";

export class ResultConsumer {
  public async start(): Promise<void> {
    await consumer.consume<CalculationResult>({
      queue: Queues.RESULT_FINAL,

      handler: async (
        message,
        correlationId
      ) => {
        if (!correlationId) {
          logger.warn({
            event: "rabbitmq.result.missing-correlation-id",
          });

          return;
        }

        logger.info({
          event: "rabbitmq.result.received",

          correlationId,

          result: message.result,
        });

        pendingRequestStore.resolve(
          correlationId,
          message
        );
      },
    });

    logger.info({
      event: "rabbitmq.result.consumer.started",
    });
  }
}

export const resultConsumer =
  new ResultConsumer();