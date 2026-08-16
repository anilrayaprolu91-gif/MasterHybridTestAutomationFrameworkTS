import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiResponse } from './api-response';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.execute<T>(() => this.request.get(`${this.baseUrl}${path}`));
  }

  async post<TResponse, TRequest>(path: string, body: TRequest): Promise<ApiResponse<TResponse>> {
    return this.execute<TResponse>(() =>
      this.request.post(`${this.baseUrl}${path}`, {
        data: body,
        headers: { 'content-type': 'application/json' },
      }),
    );
  }

  private async execute<T>(operation: () => Promise<APIResponse>): Promise<ApiResponse<T>> {
    const response = await operation();
    const headers = Object.fromEntries(
      Object.entries(response.headers()).map(([key, value]) => [key.toLowerCase(), value]),
    );

    let body: T;
    try {
      body = (await response.json()) as T;
    } catch {
      body = undefined as T;
    }

    return new ApiResponse(response.status(), headers, body);
  }
}
