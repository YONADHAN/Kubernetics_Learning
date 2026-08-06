export interface CacheStoreRequest<T = unknown> {
  key: string;

  value: T;

  ttlInSeconds?: number;
}