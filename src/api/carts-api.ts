import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import type { AddItemToCartRequest, Cart, CreateCartResponse } from '../models/cart.model';

export class CartsApi extends BaseApiClient {
  createCart(): Promise<CreateCartResponse> {
    return this.postJson<Record<string, never>, CreateCartResponse>(endpoints.carts.root, {});
  }

  addItem(cartId: string, item: AddItemToCartRequest): Promise<{ result: string }> {
    return this.postJson<AddItemToCartRequest, { result: string }>(endpoints.carts.addItem(cartId), item);
  }

  getCart(cartId: string): Promise<Cart> {
    return this.getJson<Cart>(endpoints.carts.item(cartId));
  }

  updateQuantity(cartId: string, item: AddItemToCartRequest): Promise<{ success: boolean }> {
    return this.putJson<AddItemToCartRequest, { success: boolean }>(endpoints.carts.quantity(cartId), item);
  }

  removeProduct(cartId: string, productId: string): Promise<void> {
    return this.delete(endpoints.carts.product(cartId, productId));
  }
}

export async function createCartsApi(request: APIRequestContext): Promise<CartsApi> {
  return new CartsApi(request);
}
