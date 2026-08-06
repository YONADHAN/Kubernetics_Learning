export interface DeadLetterMessage {
  correlationId: string;

  service: string;

  exchange: string;

  routingKey: string;

  payload: unknown;

  reason: string;

  failedAt: string;
}