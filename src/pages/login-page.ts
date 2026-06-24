import { expect, type Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import type { LogContext } from '../core/logger';

export class LoginPage extends BasePage {
  constructor(page: Page, loggerContext: LogContext = {}) {
    super(page, loggerContext);
  }

  async open(): Promise<void> {
    await this.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillByLabel('Email', email);
    await this.fillByLabel('Password', password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }

  async expectAuthenticated(): Promise<void> {
    await expect(this.page.getByRole('link', { name: /logout/i })).toBeVisible();
  }
}
