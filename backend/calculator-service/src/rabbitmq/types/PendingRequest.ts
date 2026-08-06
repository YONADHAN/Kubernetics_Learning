export interface PendingRequest<T = unknown> {
  resolve: (value: T) => void;

  reject: (reason?: unknown) => void;

  timeout: NodeJS.Timeout;
}