import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import { toQueryString } from './api-utils';
import type { PostcodeLookupResponse } from '../models/postcode.model';

export class PostcodeApi extends BaseApiClient {
  lookup(country: string, postcode: string, houseNumber?: string): Promise<PostcodeLookupResponse> {
    return this.getJson<PostcodeLookupResponse>(`${endpoints.postcode}${toQueryString({ country, postcode, house_number: houseNumber })}`);
  }
}

export async function createPostcodeApi(request: APIRequestContext): Promise<PostcodeApi> {
  return new PostcodeApi(request);
}
