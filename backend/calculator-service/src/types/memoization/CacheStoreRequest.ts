export interface CacheStoreRequest<T = unknown> {
  key: string;

  value: T;
}