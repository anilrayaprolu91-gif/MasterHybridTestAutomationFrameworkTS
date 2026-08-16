import { expect } from '@playwright/test';

export class ApiResponse<T> {
  constructor(
    readonly status: number,
    readonly headers: Record<string, string>,
    readonly body: T,
  ) {}

  assertStatus(expectedStatus: number): this {
    expect(this.status, 'HTTP status').toBe(expectedStatus);
    return this;
  }

  assertHeader(name: string, expectedValue: string): this {
    expect(this.headers[name.toLowerCase()], `header ${name}`).toBe(expectedValue);
    return this;
  }

  assertBody(assertion: (body: T) => void): this {
    assertion(this.body);
    return this;
  }
}
