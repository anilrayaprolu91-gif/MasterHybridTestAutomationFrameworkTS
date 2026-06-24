import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import { toQueryString } from './api-utils';
import type { Category } from '../models/product.model';

export class CategoriesApi extends BaseApiClient {
  getCategories(): Promise<Category[]> {
    return this.getJson<Category[]>(endpoints.categories.root);
  }

  getCategoryTree(parentSlug?: string): Promise<Category[]> {
    return this.getJson<Category[]>(`${endpoints.categories.tree}${toQueryString({ by_category_slug: parentSlug })}`);
  }

  searchCategories(query: string): Promise<Category[]> {
    return this.getJson<Category[]>(`${endpoints.categories.search}${toQueryString({ q: query })}`);
  }
}

export async function createCategoriesApi(request: APIRequestContext): Promise<CategoriesApi> {
  return new CategoriesApi(request);
}
