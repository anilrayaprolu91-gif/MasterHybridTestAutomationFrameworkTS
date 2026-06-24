import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';

export class TotpApi extends BaseApiClient {
  setup(accessToken: string): Promise<{ secret: string; qrCodeUrl: string }> {
    return this.postJson<Record<string, never>, { secret: string; qrCodeUrl: string }>(endpoints.totp.setup, {}, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  verify(payload: { access_token: string; totp: string }): Promise<{ message: string }> {
    return this.postJson<typeof payload, { message: string }>(endpoints.totp.verify, payload);
  }
}

export async function createTotpApi(request: APIRequestContext): Promise<TotpApi> {
  return new TotpApi(request);
}
