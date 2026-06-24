import type { AuthSession } from '../models/auth.model';
import type { CartsApi } from '../api/carts-api';
import type { InvoicesApi } from '../api/invoices-api';
import type { PaymentApi } from '../api/payment-api';
import type { Product } from '../models/product.model';
import type { InvoiceRequest } from '../models/invoice.model';
import { Logger, type LogContext } from '../core/logger';

export class CheckoutService {
  private readonly logger: Logger;

  constructor(
    private readonly cartsApi: CartsApi,
    private readonly invoicesApi: InvoicesApi,
    private readonly paymentApi: PaymentApi,
    loggerContext: LogContext = {}
  ) {
    this.logger = new Logger('CheckoutService', loggerContext);
  }

  async createCartWithProduct(product: Product, quantity = 1): Promise<string> {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.createCartWithProduct',
      method: 'SERVICE',
      productId: product.id,
      quantity
    });
    try {
      const cart = await this.cartsApi.createCart();
      await this.cartsApi.addItem(cart.id, {
        product_id: product.id,
        quantity
      });
      this.logger.info('Service action succeeded', {
        action: 'service.createCartWithProduct',
        method: 'SERVICE',
        productId: product.id,
        quantity,
        cartId: cart.id,
        durationMs: Date.now() - startedAt
      });
      return cart.id;
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.createCartWithProduct',
        method: 'SERVICE',
        productId: product.id,
        quantity,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async createInvoice(accessToken: string, cartId: string, paymentMethod: InvoiceRequest['payment_method'], paymentDetails: InvoiceRequest['payment_details']): Promise<void> {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.createInvoice',
      method: 'SERVICE',
      cartId,
      paymentMethod
    });
    try {
      await this.paymentApi.checkPayment({ payment_method: paymentMethod, payment_details: paymentDetails });
      await this.invoicesApi.createInvoice(
        {
          billing_street: '123 Test Street',
          billing_city: 'Sydney',
          billing_state: 'NSW',
          billing_country: 'Australia',
          billing_postal_code: '2000',
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          cart_id: cartId
        },
        accessToken
      );
      this.logger.info('Service action succeeded', {
        action: 'service.createInvoice',
        method: 'SERVICE',
        cartId,
        paymentMethod,
        durationMs: Date.now() - startedAt
      });
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.createInvoice',
        method: 'SERVICE',
        cartId,
        paymentMethod,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async checkoutGuest(cartId: string, guestEmail: string, guestFirstName: string, guestLastName: string): Promise<void> {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.checkoutGuest',
      method: 'SERVICE',
      cartId,
      guestEmail
    });
    try {
      await this.invoicesApi.createGuestInvoice({
        billing_street: '123 Test Street',
        billing_city: 'Sydney',
        billing_state: 'NSW',
        billing_country: 'Australia',
        billing_postal_code: '2000',
        payment_method: 'credit-card',
        payment_details: {
          credit_card_number: '4111111111111111',
          expiration_date: '12/30',
          cvv: '123',
          card_holder_name: `${guestFirstName} ${guestLastName}`
        },
        cart_id: cartId,
        guest_email: guestEmail,
        guest_first_name: guestFirstName,
        guest_last_name: guestLastName
      });
      this.logger.info('Service action succeeded', {
        action: 'service.checkoutGuest',
        method: 'SERVICE',
        cartId,
        guestEmail,
        durationMs: Date.now() - startedAt
      });
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.checkoutGuest',
        method: 'SERVICE',
        cartId,
        guestEmail,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
