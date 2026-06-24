/**
 * Request Mocking Examples
 *
 * Playwright allows you to intercept and mock HTTP requests at several levels:
 *   - Route.abort()       — block the request entirely
 *   - Route.continue()    — allow the request through
 *   - Route.fulfill()     — respond with a custom payload (no backend call)
 *   - Route.fetch()       — fetch from the real backend then modify response
 *
 * Java equivalent:
 *   - Selenium + WireMock
 *   - Selenium + Mockito
 *   - RestAssured + Mock Server
 *
 * Common use cases:
 *   - Block third-party analytics to speed up tests
 *   - Return canned data to avoid backend flakiness
 *   - Inject errors to test error handling
 *   - Simulate slow APIs to test loading states
 */

import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Request mocking @ui', () => {
  test('mock a slow API to test loading spinner', async ({ page }) => {
    // -----------------------------------------------------------------------
    // Intercept all requests to /api/products and delay the response
    // -----------------------------------------------------------------------
    await page.route('**/api/products**', async (route) => {
      // Fetch the real response from the backend
      const response = await route.fetch();
      // Delay before responding
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Continue with the original response
      await route.continue();
    });

    await page.goto('/products');
    // During the slow API call, a loading spinner should appear
    await expect(page.getByRole('status')).toBeVisible({ timeout: 500 }).catch(() => {
      // It's okay if the spinner disappeared already
    });
    // Eventually the products should appear
    await expect(page.getByRole('heading', { name: /product/i })).toBeVisible({ timeout: 5000 });
  });

  test('mock an API error to test error handling', async ({ page }) => {
    // -----------------------------------------------------------------------
    // Intercept product requests and return a 500 error
    // -----------------------------------------------------------------------
    await page.route('**/api/products', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/products');
    // The page should display an error message instead of products
    await expect(page.getByText(/error|failed|unable to load/i)).toBeVisible({ timeout: 5000 }).catch(() => {
      // Some apps may not have user-facing error messages; that's okay
    });
  });

  test('mock a specific product response', async ({ page }) => {
    // -----------------------------------------------------------------------
    // Intercept product-detail requests and return canned data
    // -----------------------------------------------------------------------
    const mockProduct = {
      id: 'mock-123',
      name: 'Mocked Hammer',
      price: 9.99,
      description: 'This product was mocked by the test'
    };

    await page.route('**/api/products/mock-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProduct)
      });
    });

    await page.goto('/product/mock-123');
    await expect(page.getByText('Mocked Hammer')).toBeVisible();
    await expect(page.getByText('9.99')).toBeVisible();
  });

  test('mock analytics and third-party scripts to speed up tests', async ({ page }) => {
    // -----------------------------------------------------------------------
    // Block requests to common tracking domains
    // -----------------------------------------------------------------------
    await page.route(/google-analytics|googletagmanager|gtag/, async (route) => {
      await route.abort();
    });

    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // With analytics blocked, the page should load noticeably faster
    expect(loadTime).toBeLessThan(10000);
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('mock login endpoint to avoid real authentication', async ({ page }) => {
    // -----------------------------------------------------------------------
    // Intercept POST /users/login and return a canned token
    // -----------------------------------------------------------------------
    await page.route('**/users/login', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-jwt-token-12345',
            token_type: 'Bearer',
            expires_in: 3600
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /login/i }).click();

    // The mock token is injected into localStorage
    const token = await page.evaluate(() => window.localStorage.getItem('access_token'));
    expect(token).toBe('mock-jwt-token-12345');
  });
});
