import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import type { Product } from '../models/product.model';

export class FavoritesApi extends BaseApiClient {
  getFavorites(accessToken: string): Promise<Array<{ id: string; product_id: string; user_id: string; product?: Product }>> {
    return this.getJson<Array<{ id: string; product_id: string; user_id: string; product?: Product }>>(endpoints.favorites.root);
  }

  addFavorite(productId: string, accessToken: string): Promise<{ id: string; product_id: string; user_id: string }> {
    return this.postJson<{ product_id: string }, { id: string; product_id: string; user_id: string }>(endpoints.favorites.root, { product_id: productId }, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  deleteFavorite(favoriteId: string, accessToken: string): Promise<void> {
    return this.delete(endpoints.favorites.item(favoriteId), {
      Authorization: `Bearer ${accessToken}`
    });
  }
}

export async function createFavoritesApi(request: APIRequestContext): Promise<FavoritesApi> {
  return new FavoritesApi(request);
}
