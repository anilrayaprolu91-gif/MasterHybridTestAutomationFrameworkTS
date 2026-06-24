import { expect } from '@playwright/test';

export async function expectArrayNotEmpty<T>(value: T[]): Promise<void> {
  expect(value.length).toBeGreaterThan(0);
}

export async function expectTruthy(value: unknown, message = 'Expected value to be truthy'): Promise<void> {
  expect(value, message).toBeTruthy();
}
