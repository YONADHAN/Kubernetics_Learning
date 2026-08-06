export interface PublishMessage<T = unknown> {
  exchange: string;
  routingKey: string;
  message: T;

  correlationId?: string;

  headers?: Record<string, unknown>;
}