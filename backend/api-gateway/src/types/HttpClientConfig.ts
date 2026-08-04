export interface HttpClientConfig {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
}