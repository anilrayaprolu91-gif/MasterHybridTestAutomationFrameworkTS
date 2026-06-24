import { expect, type Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import type { LogContext } from '../core/logger';

export class HomePage extends BasePage {
  constructor(page: Page, loggerContext: LogContext = {}) {
    super(page, loggerContext);
  }

  async open(): Promise<void> {
    await this.goto('/');
    await expect(this.page).toHaveURL(/practicesoftwaretesting\.com/);
  }

  async openLogin(): Promise<void> {
    await this.page.getByRole('link', { name: /login/i }).click();
  }

  async search(term: string): Promise<void> {
    await this.page.getByRole('textbox', { name: /search/i }).fill(term);
    await this.page.keyboard.press('Enter');
  }

  async openCart(): Promise<void> {
    await this.page.getByRole('link', { name: /cart/i }).click();
  }
}
