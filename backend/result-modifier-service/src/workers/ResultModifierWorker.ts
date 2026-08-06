import { consumer } from "../rabbitmq/Consumer";
import { publisher } from "../rabbitmq/Publisher";

import { resultModifierService } from "../services/ResultModifierService";

import { calculationResultSchema } from "../validators/calculationResultSchema";

import { Exchanges } from "../rabbitmq/topology/exchanges";
import { Queues } from "../rabbitmq/topology/queues";
import { RoutingKeys } from "../rabbitmq/topology/routingKeys";

import { logger } from "../config/logger";

import type { CalculationResultMessage } from "../types/CalculationResultMessage";

export class ResultModifierWorker {
  public async start(): Promise<void> {
    await consumer.consume<CalculationResultMessage>({
      queue: Queues.RESULT_RAW,

      schema: calculationResultSchema,

      handler: async (message) => {
        logger.info({
          event: "result.modifier.received",
          correlationId: message.correlationId,
        });

        const result =
          resultModifierService.modify(
            message
          );

        await publisher.publish({
          exchange: Exchanges.RESULT_FINAL,

          routingKey:
            RoutingKeys.RESULT_FINAL,

          correlationId:
            message.correlationId,

          message: result,
        });

        logger.info({
          event: "result.modifier.completed",
          correlationId: message.correlationId,
        });
      },
    });

    logger.info({
      event: "result.modifier.worker.started",
      queue: Queues.RESULT_RAW,
    });
  }
}

export const resultModifierWorker =
  new ResultModifierWorker();