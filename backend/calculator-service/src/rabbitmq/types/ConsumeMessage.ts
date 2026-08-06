export interface ConsumeMessage<T = unknown> {
  queue: string;

  handler: (
    message: T,
    correlationId?: string
  ) => Promise<void>;
}