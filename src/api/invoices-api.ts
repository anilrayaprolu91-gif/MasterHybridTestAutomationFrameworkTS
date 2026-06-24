import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import { toQueryString } from './api-utils';
import type { InvoiceRequest, InvoiceResponse } from '../models/invoice.model';
import type { PaginatedResponse } from '../models/user.model';

export class InvoicesApi extends BaseApiClient {
  getInvoices(accessToken: string, page?: number): Promise<PaginatedResponse<InvoiceResponse>> {
    return this.getJson<PaginatedResponse<InvoiceResponse>>(`${endpoints.invoices.root}${toQueryString({ page })}`);
  }

  getInvoice(invoiceId: string, accessToken: string): Promise<InvoiceResponse> {
    return this.getJson<InvoiceResponse>(endpoints.invoices.item(invoiceId));
  }

  createInvoice(invoice: InvoiceRequest, accessToken: string): Promise<InvoiceResponse> {
    return this.postJson<InvoiceRequest, InvoiceResponse>(endpoints.invoices.root, invoice, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  createGuestInvoice(invoice: InvoiceRequest & { guest_email: string; guest_first_name: string; guest_last_name: string }): Promise<InvoiceResponse> {
    return this.postJson<typeof invoice, InvoiceResponse>(endpoints.invoices.guest, invoice);
  }

  updateInvoiceStatus(invoiceId: string, payload: { status: string; status_message?: string }, accessToken: string): Promise<{ success: boolean }> {
    return this.putJson<typeof payload, { success: boolean }>(endpoints.invoices.status(invoiceId), payload, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  searchInvoices(query: string, page?: number, accessToken?: string): Promise<PaginatedResponse<InvoiceResponse>> {
    return this.getJson<PaginatedResponse<InvoiceResponse>>(`${endpoints.invoices.search}${toQueryString({ q: query, page })}`);
  }
}

export async function createInvoicesApi(request: APIRequestContext): Promise<InvoicesApi> {
  return new InvoicesApi(request);
}
