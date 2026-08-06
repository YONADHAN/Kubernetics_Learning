import { consumer } from "../rabbitmq/Consumer";
import { publisher } from "../rabbitmq/Publisher";

import { divisionService } from "../services/DivisionService";

import { calculationMessageSchema } from "../validators/calculationMessageSchema";

import { Exchanges } from "../rabbitmq/topology/exchanges";
import { Queues } from "../rabbitmq/topology/queues";
import { RoutingKeys } from "../rabbitmq/topology/routingKeys";

import { logger } from "../config/logger";

import type { CalculationMessage } from "../types/CalculationMessage";

export class DivisionWorker {
  public async start(): Promise<void> {
    await consumer.consume<CalculationMessage>({
      queue: Queues.DIVISION,

      schema: calculationMessageSchema,

      handler: async (message) => {
        logger.info({
          event: "division.request.received",
          correlationId:
            message.correlationId,
        });

        const result =
          divisionService.calculate(
            message
          );

        await publisher.publish({
          exchange: Exchanges.RESULT_RAW,

          routingKey:
            RoutingKeys.RESULT_RAW,

          correlationId:
            message.correlationId,

          message: result,
        });

        logger.info({
          event: "division.completed",
          correlationId:
            message.correlationId,
        });
      },
    });

    logger.info({
      event: "division.worker.started",
      queue: Queues.DIVISION,
    });
  }
}

export const divisionWorker =
  new DivisionWorker();