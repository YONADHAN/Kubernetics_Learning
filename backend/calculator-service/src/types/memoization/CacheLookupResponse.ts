export interface CacheLookupResponse<T = unknown> {
  success: boolean;

  hit: boolean;

  value?: T;
}