import { expect, type Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import type { LogContext } from '../core/logger';

export class ProductPage extends BasePage {
  constructor(page: Page, loggerContext: LogContext = {}) {
    super(page, loggerContext);
  }

  async addToCart(): Promise<void> {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }

  async addToFavorites(): Promise<void> {
    await this.page.getByRole('button', { name: /favorite/i }).click();
  }

  async expectProductHeading(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: new RegExp(name, 'i') })).toBeVisible();
  }
}
