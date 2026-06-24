import { expect, type Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import type { LogContext } from '../core/logger';

export class CheckoutPage extends BasePage {
  constructor(page: Page, loggerContext: LogContext = {}) {
    super(page, loggerContext);
  }

  async fillShippingAddress(address: { street: string; city: string; state: string; country: string; postalCode: string }): Promise<void> {
    await this.fillByLabel('Street', address.street);
    await this.fillByLabel('City', address.city);
    await this.fillByLabel('State', address.state);
    await this.fillByLabel('Country', address.country);
    await this.fillByLabel('Postal Code', address.postalCode);
  }

  async fillPaymentDetails(card: { cardNumber: string; expirationDate: string; cvv: string; cardHolderName: string }): Promise<void> {
    await this.fillByLabel('Card Number', card.cardNumber);
    await this.fillByLabel('Expiration Date', card.expirationDate);
    await this.fillByLabel('CVV', card.cvv);
    await this.fillByLabel('Card Holder Name', card.cardHolderName);
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole('button', { name: /place order/i }).click();
  }

  async expectConfirmation(): Promise<void> {
    await expect(this.page.getByText(/order confirmed|thank you for your order/i)).toBeVisible();
  }

  
}
