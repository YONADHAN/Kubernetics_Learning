import type { DeadLetterMessage } from "../types/DeadLetterMessage";

export class FailureNotification {
    public static build(
        message: DeadLetterMessage
    ) {
        return {
            subject:
                "Distributed Calculator - Dead Letter Queue Alert",

            text: `
A message has been moved to the Dead Letter Queue.

Service: ${message.service}

Correlation ID: ${message.correlationId}

Exchange: ${message.exchange}

Routing Key: ${message.routingKey}

Reason: ${message.reason}

Failed At: ${message.failedAt}

Payload:

${JSON.stringify(
                message.payload,
                null,
                2
            )}
`,
        };
    }
}