import { consumer } from "../rabbitmq/Consumer";

import { inboxRepository } from "../repositories/InboxRepository";

import { emailService } from "../services/EmailService";

import { deadLetterSchema } from "../validators/deadLetterSchema";

import { Queues } from "../rabbitmq/topology/queues";

import { logger } from "../config/logger";

import type { DeadLetterMessage } from "../types/DeadLetterMessage";

export class EmailWorker {
  public async start(): Promise<void> {
    await consumer.consume<DeadLetterMessage>({
      queue: Queues.DEAD_LETTER,

      schema: deadLetterSchema,

      handler: async (message:DeadLetterMessage) => {
        if (
          await inboxRepository.isProcessed(
            message.correlationId
          )
        ) {
          logger.info({
            event:
              "email.duplicate.ignored",

            correlationId:
              message.correlationId,
          });

          return;
        }

        await emailService.sendFailureNotification(
          message
        );

        await inboxRepository.markProcessed(
          message.correlationId
        );

        logger.info({
          event:
            "email.notification.sent",

          correlationId:
            message.correlationId,
        });
      },
    });

    logger.info({
      event: "email.worker.started",

      queue:
        Queues.DEAD_LETTER,
    });
  }
}

export const emailWorker =
  new EmailWorker();