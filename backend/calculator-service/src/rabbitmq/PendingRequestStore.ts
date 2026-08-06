import type { PendingRequest } from "./types/PendingRequest";

export class PendingRequestStore {
  private readonly requests = new Map<
    string,
    PendingRequest
  >();

  public create<T>(
    correlationId: string,
    timeoutMs = 30000
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.requests.delete(correlationId);

        reject(
          new Error(
            "Calculation request timed out."
          )
        );
      }, timeoutMs);

      this.requests.set(correlationId, {
        // wrap resolve to accept unknown (matches PendingRequest type)
        resolve: (value: unknown) => resolve(value as T),
        reject,
        timeout,
      });
    });
  }

  public resolve<T>(
    correlationId: string,
    result: T
  ): void {
    const request =
      this.requests.get(correlationId);

    if (!request) {
      return;
    }

    clearTimeout(request.timeout);

    request.resolve(result);

    this.requests.delete(correlationId);
  }

  public reject(
    correlationId: string,
    reason: unknown
  ): void {
    const request =
      this.requests.get(correlationId);

    if (!request) {
      return;
    }

    clearTimeout(request.timeout);

    request.reject(reason);

    this.requests.delete(correlationId);
  }

  public has(
    correlationId: string
  ): boolean {
    return this.requests.has(correlationId);
  }

  public remove(
    correlationId: string
  ): void {
    const request =
      this.requests.get(correlationId);

    if (!request) {
      return;
    }

    clearTimeout(request.timeout);

    this.requests.delete(correlationId);
  }
}

export const pendingRequestStore =
  new PendingRequestStore();