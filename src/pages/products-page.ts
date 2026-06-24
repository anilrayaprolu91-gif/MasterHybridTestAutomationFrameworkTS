import { expect, type Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import type { LogContext } from '../core/logger';

export class ProductsPage extends BasePage {
  constructor(page: Page, loggerContext: LogContext = {}) {
    super(page, loggerContext);
  }

  async open(): Promise<void> {
    await this.goto('/products');
    await expect(this.page.getByRole('heading', { name: /products/i })).toBeVisible();
  }

  async searchProduct(term: string): Promise<void> {
    await this.page.getByRole('textbox', { name: /search/i }).fill(term);
    await this.page.keyboard.press('Enter');
  }

  async filterByCategory(category: string): Promise<void> {
    await this.page.getByText(category, { exact: false }).click();
  }

  async openFirstProduct(): Promise<void> {
    await this.page.locator('a[href*="/product/"]').first().click();
  }
}
