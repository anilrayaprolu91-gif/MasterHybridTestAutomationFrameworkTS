import { test as base, type APIRequestContext, type Page, type TestInfo } from '@playwright/test';
import { loadEnvironment } from '../config/environment';
import { AuthApi } from '../api/auth-api';
import { ProductsApi } from '../api/products-api';
import { CategoriesApi } from '../api/categories-api';
import { CartsApi } from '../api/carts-api';
import { UsersApi } from '../api/users-api';
import { InvoicesApi } from '../api/invoices-api';
import { ReportsApi } from '../api/reports-api';
import { ContactApi } from '../api/contact-api';
import { PaymentApi } from '../api/payment-api';
import { PostcodeApi } from '../api/postcode-api';
import { FavoritesApi } from '../api/favorites-api';
import { TotpApi } from '../api/totp-api';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';
import { ProductPage } from '../pages/product-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { AuthService } from '../services/auth-service';
import { CatalogService } from '../services/catalog-service';
import { CheckoutService } from '../services/checkout-service';

const environment = loadEnvironment();

const apiFixture = <T>(factory: (request: APIRequestContext, context: { correlationId: string }) => T) => async (
  { request, correlationId }: { request: APIRequestContext; correlationId: string },
  use: (value: T) => Promise<void>
): Promise<void> => {
  await use(factory(request, { correlationId }));
};

const pageFixture = <T>(factory: (page: Page, context: { correlationId: string }) => T) => async (
  { page, correlationId }: { page: Page; correlationId: string },
  use: (value: T) => Promise<void>
): Promise<void> => {
  await use(factory(page, { correlationId }));
};

const correlationIdFixture = async (
  {},
  use: (value: string) => Promise<void>,
  testInfo: TestInfo
): Promise<void> => {
  await use(`${testInfo.project.name}:${testInfo.testId}`);
};

export type AppContext = {
  correlationId: string;
};

export type AppApis = {
  authApi: AuthApi;
  productsApi: ProductsApi;
  categoriesApi: CategoriesApi;
  cartsApi: CartsApi;
  usersApi: UsersApi;
  invoicesApi: InvoicesApi;
  reportsApi: ReportsApi;
  contactApi: ContactApi;
  paymentApi: PaymentApi;
  postcodeApi: PostcodeApi;
  favoritesApi: FavoritesApi;
  totpApi: TotpApi;
};

export type AppPages = {
  homePage: HomePage;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export type AppServices = {
  authService: AuthService;
  catalogService: CatalogService;
  checkoutService: CheckoutService;
};

export const test = base.extend<AppContext & AppApis & AppPages & AppServices>({
  correlationId: correlationIdFixture,
  authApi: apiFixture((request, context) => new AuthApi(request, context)),
  productsApi: apiFixture((request, context) => new ProductsApi(request, context)),
  categoriesApi: apiFixture((request, context) => new CategoriesApi(request, context)),
  cartsApi: apiFixture((request, context) => new CartsApi(request, context)),
  usersApi: apiFixture((request, context) => new UsersApi(request, context)),
  invoicesApi: apiFixture((request, context) => new InvoicesApi(request, context)),
  reportsApi: apiFixture((request, context) => new ReportsApi(request, context)),
  contactApi: apiFixture((request, context) => new ContactApi(request, context)),
  paymentApi: apiFixture((request, context) => new PaymentApi(request, context)),
  postcodeApi: apiFixture((request, context) => new PostcodeApi(request, context)),
  favoritesApi: apiFixture((request, context) => new FavoritesApi(request, context)),
  totpApi: apiFixture((request, context) => new TotpApi(request, context)),
  homePage: pageFixture((page, context) => new HomePage(page, context)),
  loginPage: pageFixture((page, context) => new LoginPage(page, context)),
  productsPage: pageFixture((page, context) => new ProductsPage(page, context)),
  productPage: pageFixture((page, context) => new ProductPage(page, context)),
  cartPage: pageFixture((page, context) => new CartPage(page, context)),
  checkoutPage: pageFixture((page, context) => new CheckoutPage(page, context)),
  authService: async ({ authApi, correlationId }, use) => {
    await use(new AuthService(authApi, { correlationId }));
  },
  catalogService: async ({ productsApi, categoriesApi, correlationId }, use) => {
    await use(new CatalogService(productsApi, categoriesApi, { correlationId }));
  },
  checkoutService: async ({ cartsApi, invoicesApi, paymentApi, correlationId }, use) => {
    await use(new CheckoutService(cartsApi, invoicesApi, paymentApi, { correlationId }));
  }
});

export const expect = test.expect;
export const env = environment;
export type { APIRequestContext };
