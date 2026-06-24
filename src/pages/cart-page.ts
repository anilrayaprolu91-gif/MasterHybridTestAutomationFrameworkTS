import { expect, type Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import type { LogContext } from '../core/logger';

export class CartPage extends BasePage {
  constructor(page: Page, loggerContext: LogContext = {}) {
    super(page, loggerContext);
  }

  async open(): Promise<void> {
    await this.goto('/checkout');
  }

  async setQuantity(productName: string, quantity: number): Promise<void> {
    const row = this.page.getByRole('row', { name: new RegExp(productName, 'i') });
    await row.getByRole('spinbutton').fill(String(quantity));
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole('button', { name: /checkout/i }).click();
  }

  async expectCartVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /cart/i })).toBeVisible();
  }
}
