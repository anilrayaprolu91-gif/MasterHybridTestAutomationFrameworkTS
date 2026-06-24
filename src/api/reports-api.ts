import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import { toQueryString } from './api-utils';

export class ReportsApi extends BaseApiClient {
  getTotalSalesPerCountry(accessToken: string): Promise<Array<{ billing_country: string; total_sales: string }>> {
    return this.getJson<Array<{ billing_country: string; total_sales: string }>>(endpoints.reports.totalSalesPerCountry);
  }

  getTopPurchasedProducts(accessToken: string): Promise<Array<{ name: string; count: number }>> {
    return this.getJson<Array<{ name: string; count: number }>>(endpoints.reports.top10PurchasedProducts);
  }

  getBestSellingCategories(accessToken: string): Promise<Array<{ category_name: string; total_earned: string }>> {
    return this.getJson<Array<{ category_name: string; total_earned: string }>>(endpoints.reports.top10BestSellingCategories);
  }

  getTotalSalesOfYears(years = 1, accessToken: string): Promise<Array<{ year: number; total: number }>> {
    return this.getJson<Array<{ year: number; total: number }>>(`${endpoints.reports.totalSalesOfYears}${toQueryString({ years })}`);
  }

  getAverageSalesPerMonth(year?: number, accessToken?: string): Promise<Array<{ month: number; average: number; amount: number }>> {
    return this.getJson<Array<{ month: number; average: number; amount: number }>>(`${endpoints.reports.averageSalesPerMonth}${toQueryString({ year })}`);
  }

  getAverageSalesPerWeek(year?: number, accessToken?: string): Promise<Array<{ week: number; average: number; amount: number }>> {
    return this.getJson<Array<{ week: number; average: number; amount: number }>>(`${endpoints.reports.averageSalesPerWeek}${toQueryString({ year })}`);
  }

  getCustomersByCountry(accessToken: string): Promise<Array<{ country: string; amount: number }>> {
    return this.getJson<Array<{ country: string; amount: number }>>(endpoints.reports.customersByCountry);
  }
}

export async function createReportsApi(request: APIRequestContext): Promise<ReportsApi> {
  return new ReportsApi(request);
}
