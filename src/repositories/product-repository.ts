import type { ProductsApi } from '../api/products-api';
import type { Product } from '../models/product.model';

export class ProductRepository {
  constructor(private readonly productsApi: ProductsApi) {}

  list(): Promise<{ data: Product[] }> {
    return this.productsApi.getProducts();
  }

  search(name: string): Promise<{ data: Product[] }> {
    return this.productsApi.searchProducts(name);
  }

  byId(productId: string): Promise<Product> {
    return this.productsApi.getProduct(productId);
  }
}
