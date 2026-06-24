import type { ProductsApi } from '../api/products-api';
import type { CategoriesApi } from '../api/categories-api';
import { Logger, type LogContext } from '../core/logger';

export class CatalogService {
  private readonly logger: Logger;

  constructor(
    private readonly productsApi: ProductsApi,
    private readonly categoriesApi: CategoriesApi,
    loggerContext: LogContext = {}
  ) {
    this.logger = new Logger('CatalogService', loggerContext);
  }

  async findProductByName(name: string) {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.findProductByName',
      method: 'SERVICE',
      query: name
    });
    try {
      const products = await this.productsApi.searchProducts(name);
      const product = products.data.find((item) => item.name.toLowerCase().includes(name.toLowerCase()));
      this.logger.info('Service action succeeded', {
        action: 'service.findProductByName',
        method: 'SERVICE',
        query: name,
        matched: Boolean(product),
        durationMs: Date.now() - startedAt
      });
      return product;
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.findProductByName',
        method: 'SERVICE',
        query: name,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async getProducts() {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.getProducts',
      method: 'SERVICE'
    });
    try {
      const response = await this.productsApi.getProducts();
      this.logger.info('Service action succeeded', {
        action: 'service.getProducts',
        method: 'SERVICE',
        count: response.data.length,
        durationMs: Date.now() - startedAt
      });
      return response;
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.getProducts',
        method: 'SERVICE',
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async getCategories() {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.getCategories',
      method: 'SERVICE'
    });
    try {
      const categories = await this.categoriesApi.getCategories();
      this.logger.info('Service action succeeded', {
        action: 'service.getCategories',
        method: 'SERVICE',
        count: categories.length,
        durationMs: Date.now() - startedAt
      });
      return categories;
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.getCategories',
        method: 'SERVICE',
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
