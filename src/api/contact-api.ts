import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import type { ContactMessage, ContactRequest } from '../models/contact.model';

export class ContactApi extends BaseApiClient {
  getMessages(accessToken: string): Promise<ContactMessage[]> {
    return this.getJson<ContactMessage[]>(endpoints.contact.messages);
  }

  getMessage(messageId: string, accessToken: string): Promise<ContactMessage> {
    return this.getJson<ContactMessage>(endpoints.contact.message(messageId));
  }

  sendMessage(message: ContactRequest, accessToken?: string): Promise<{ success: boolean }> {
    return this.postJson<ContactRequest, { success: boolean }>(endpoints.contact.messages, message, accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined);
  }
}

export async function createContactApi(request: APIRequestContext): Promise<ContactApi> {
  return new ContactApi(request);
}
