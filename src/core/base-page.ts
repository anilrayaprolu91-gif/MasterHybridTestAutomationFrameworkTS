import { expect, type Locator, type Page } from '@playwright/test';
import { Logger, type LogContext } from './logger';

export class BasePage {
  private readonly logger: Logger;

  constructor(
    protected readonly page: Page,
    loggerContext: LogContext = {}
  ) {
    this.logger = new Logger(this.constructor.name, loggerContext);
  }

  async goto(path = '/') {
    return this.runAction('goto', { path }, async () => {
      await this.page.goto(path);
    });
  }

  locatorByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  async clickByTestId(testId: string): Promise<void> {
    return this.runAction('clickByTestId', { testId }, async () => {
      await this.locatorByTestId(testId).click();
    });
  }

  async fillByLabel(label: string, value: string): Promise<void> {
    return this.runAction('fillByLabel', { label, hasValue: value.length > 0 }, async () => {
      await this.page.getByLabel(label).fill(value);
    });
  }

  async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
    return this.runAction('fillByPlaceholder', { placeholder, hasValue: value.length > 0 }, async () => {
      await this.page.getByPlaceholder(placeholder).fill(value);
    });
  }

  async expectVisibleByRole(role: Parameters<Page['getByRole']>[0], name: string): Promise<void> {
    return this.runAction('expectVisibleByRole', { role, name }, async () => {
      await expect(this.page.getByRole(role, { name })).toBeVisible();
    });
  }

  protected async runAction<T>(action: string, context: Record<string, unknown>, operation: () => Promise<T>): Promise<T> {
    const startedAt = Date.now();
    this.logger.info('UI action started', {
      action,
      method: 'UI',
      ...context
    });

    try {
      const result = await operation();
      this.logger.info('UI action succeeded', {
        action,
        method: 'UI',
        durationMs: Date.now() - startedAt,
        ...context
      });
      return result;
    } catch (error: unknown) {
      this.logger.error('UI action failed', {
        action,
        method: 'UI',
        durationMs: Date.now() - startedAt,
        error: this.getErrorMessage(error),
        ...context
      });
      throw error;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
