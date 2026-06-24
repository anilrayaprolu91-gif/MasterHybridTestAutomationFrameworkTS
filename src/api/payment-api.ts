import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import type { PaymentDetails, PaymentMethod } from '../models/invoice.model';

export class PaymentApi extends BaseApiClient {
  checkPayment(payload: { payment_method: PaymentMethod; payment_details: PaymentDetails }): Promise<{ message: string }> {
    return this.postJson<typeof payload, { message: string }>(endpoints.payment.check, payload);
  }
}

export async function createPaymentApi(request: APIRequestContext): Promise<PaymentApi> {
  return new PaymentApi(request);
}
