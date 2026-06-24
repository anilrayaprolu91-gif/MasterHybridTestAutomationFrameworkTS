import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import { toQueryString } from './api-utils';
import type { PaginatedResponse } from '../models/user.model';
import type { Product, ProductRequest, ProductSpec } from '../models/product.model';

export class ProductsApi extends BaseApiClient {
  getProducts(filters: { by_brand?: string; by_category?: string; is_rental?: string; between?: string; sort?: string; page?: number } = {}): Promise<PaginatedResponse<Product>> {
    return this.getJson<PaginatedResponse<Product>>(`${endpoints.products.root}${toQueryString(filters)}`);
  }

  getProduct(productId: string): Promise<Product> {
    return this.getJson<Product>(endpoints.products.item(productId));
  }

  searchProducts(query: string, page?: number): Promise<PaginatedResponse<Product>> {
    return this.getJson<PaginatedResponse<Product>>(`${endpoints.products.search}${toQueryString({ q: query, page })}`);
  }

  getRelatedProducts(productId: string): Promise<Product[]> {
    return this.getJson<Product[]>(endpoints.products.related(productId));
  }

  getProductSpecs(productId: string): Promise<ProductSpec[]> {
    return this.getJson<ProductSpec[]>(endpoints.products.specs(productId));
  }

  createProduct(product: ProductRequest): Promise<Product> {
    return this.postJson<ProductRequest, Product>(endpoints.products.root, product);
  }

  updateProduct(productId: string, product: Partial<ProductRequest>): Promise<Product> {
    return this.putJson<Partial<ProductRequest>, Product>(endpoints.products.item(productId), product);
  }
}

export async function createProductsApi(request: APIRequestContext): Promise<ProductsApi> {
  return new ProductsApi(request);
}
