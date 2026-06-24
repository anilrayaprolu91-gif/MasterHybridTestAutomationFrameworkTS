import type { APIRequestContext } from '@playwright/test';
import { Logger, type LogContext } from './logger';

export class BaseApiClient {
  private readonly logger: Logger;

  constructor(
    protected readonly request: APIRequestContext,
    loggerContext: LogContext = {}
  ) {
    this.logger = new Logger(this.constructor.name, loggerContext);
  }

  protected async getJson<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const startedAt = Date.now();
    this.logRequestStart('GET', path, false);
    try {
      const response = await this.request.get(path, headers ? { headers } : {});
      return this.handleJson<T>(response, path, 'GET', startedAt);
    } catch (error: unknown) {
      this.logTransportError('GET', path, startedAt, error);
      throw error;
    }
  }

  protected async postJson<TRequest extends object | undefined, TResponse>(
    path: string,
    body?: TRequest,
    headers?: Record<string, string>
  ): Promise<TResponse> {
    const startedAt = Date.now();
    this.logRequestStart('POST', path, body !== undefined);
    try {
      const response = await this.request.post(path, headers ? { data: body, headers } : { data: body });
      return this.handleJson<TResponse>(response, path, 'POST', startedAt);
    } catch (error: unknown) {
      this.logTransportError('POST', path, startedAt, error);
      throw error;
    }
  }

  protected async putJson<TRequest extends object | undefined, TResponse>(
    path: string,
    body?: TRequest,
    headers?: Record<string, string>
  ): Promise<TResponse> {
    const startedAt = Date.now();
    this.logRequestStart('PUT', path, body !== undefined);
    try {
      const response = await this.request.put(path, headers ? { data: body, headers } : { data: body });
      return this.handleJson<TResponse>(response, path, 'PUT', startedAt);
    } catch (error: unknown) {
      this.logTransportError('PUT', path, startedAt, error);
      throw error;
    }
  }

  protected async patchJson<TRequest extends object | undefined, TResponse>(
    path: string,
    body?: TRequest,
    headers?: Record<string, string>
  ): Promise<TResponse> {
    const startedAt = Date.now();
    this.logRequestStart('PATCH', path, body !== undefined);
    try {
      const response = await this.request.patch(path, headers ? { data: body, headers } : { data: body });
      return this.handleJson<TResponse>(response, path, 'PATCH', startedAt);
    } catch (error: unknown) {
      this.logTransportError('PATCH', path, startedAt, error);
      throw error;
    }
  }

  protected async delete(path: string, headers?: Record<string, string>): Promise<void> {
    const startedAt = Date.now();
    this.logRequestStart('DELETE', path, false);
    try {
      const response = await this.request.delete(path, headers ? { headers } : {});
      if (!response.ok()) {
        const bodyText = await response.text();
        this.logger.error('API request failed', {
          action: 'api.request',
          method: 'DELETE',
          path,
          status: response.status(),
          durationMs: Date.now() - startedAt,
          error: `HTTP ${response.status()}`,
          errorBody: this.truncate(bodyText)
        });
        throw new Error(`DELETE ${path} failed with status ${response.status()}: ${bodyText}`);
      }

      this.logger.info('API request succeeded', {
        action: 'api.request',
        method: 'DELETE',
        path,
        status: response.status(),
        durationMs: Date.now() - startedAt
      });
    } catch (error: unknown) {
      this.logTransportError('DELETE', path, startedAt, error);
      throw error;
    }
  }

  protected async getVoid(path: string, headers?: Record<string, string>): Promise<void> {
    const startedAt = Date.now();
    this.logRequestStart('GET', path, false);
    try {
      const response = await this.request.get(path, headers ? { headers } : {});
      if (!response.ok()) {
        const bodyText = await response.text();
        this.logger.error('API request failed', {
          action: 'api.request',
          method: 'GET',
          path,
          status: response.status(),
          durationMs: Date.now() - startedAt,
          error: `HTTP ${response.status()}`,
          errorBody: this.truncate(bodyText)
        });
        throw new Error(`GET ${path} failed with status ${response.status()}: ${bodyText}`);
      }

      this.logger.info('API request succeeded', {
        action: 'api.request',
        method: 'GET',
        path,
        status: response.status(),
        durationMs: Date.now() - startedAt
      });
    } catch (error: unknown) {
      this.logTransportError('GET', path, startedAt, error);
      throw error;
    }
  }

  private async handleJson<T>(
    response: Awaited<ReturnType<APIRequestContext['get']>>,
    path: string,
    method: string,
    startedAt: number
  ): Promise<T> {
    if (!response.ok()) {
      const bodyText = await response.text();
      this.logger.error('API request failed', {
        action: 'api.request',
        method,
        path,
        status: response.status(),
        durationMs: Date.now() - startedAt,
        error: `HTTP ${response.status()}`,
        errorBody: this.truncate(bodyText)
      });
      throw new Error(`${method} ${path} failed with status ${response.status()}: ${bodyText}`);
    }

    this.logger.info('API request succeeded', {
      action: 'api.request',
      method,
      path,
      status: response.status(),
      durationMs: Date.now() - startedAt
    });

    return (await response.json()) as T;
  }

  private logRequestStart(method: string, path: string, hasBody: boolean): void {
    this.logger.info('API request started', {
      action: 'api.request',
      method,
      path,
      hasBody
    });
  }

  private logTransportError(method: string, path: string, startedAt: number, error: unknown): void {
    this.logger.error('API request transport error', {
      action: 'api.request',
      method,
      path,
      durationMs: Date.now() - startedAt,
      error: this.getErrorMessage(error)
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  private truncate(value: string, maxLength = 500): string {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength)}...`;
  }
}
