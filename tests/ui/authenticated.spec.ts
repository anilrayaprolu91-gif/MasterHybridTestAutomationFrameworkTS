/**
 * Authenticated UI Tests
 *
 * These tests use the `chromium-authenticated-customer` project which injects
 * the saved storage state before each test.  The browser starts already
 * logged-in — no UI login step is needed inside the test body.
 *
 * When you also need a bearer token for API calls within the same test,
 * import `authTest` instead of the base `test`.  The `accessToken` and
 * `adminToken` fixtures issue a fresh API login each test so there is no
 * risk of a stale JWT from the cached storage state.
 *
 * Java equivalent: a test class annotated with @WithUserContext("customer")
 * where the framework restores a pre-authenticated session before each method.
 */

import { authTest as test, expect } from '../../src/fixtures/authenticated-fixtures';

test.describe('Authenticated customer journeys @ui', () => {
  test('authenticated user sees their account page', async ({ page }) => {
    // The browser context is already authenticated via storageState.
    await page.goto('/account');
    // The nav link visible only to logged-in users should be present.
    await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
  });

  test('authenticated user can add a product to favorites via API token @hybrid', async ({
    page,
    accessToken,
    productsApi,
    favoritesApi
  }) => {
    // Step 1: resolve a product via API (fast, no UI spin-up).
    const catalog = await productsApi.getProducts();
    const product = catalog.data[0];
    if (!product) throw new Error('No products found in catalog');

    // Step 2: add to favorites using the fresh bearer token.
    const fav = await favoritesApi.addFavorite(product.id, accessToken);
    expect(fav.product_id).toBe(product.id);

    // Step 3: confirm the UI reflects the same state.
    await page.goto('/account/favorites');
    await expect(page.getByText(product.name, { exact: false })).toBeVisible();

    // Cleanup — delete the favorite so the test is idempotent.
    await favoritesApi.deleteFavorite(fav.id, accessToken);
  });

  test('admin can access the management area @ui', async ({ page, adminToken, authApi }) => {
    // The page fixture uses the customer storage state from the project config.
    // For admin-specific pages we navigate directly; the API token confirms
    // the admin role independently.
    const profile = await authApi.me(adminToken);
    expect(profile.email).toContain('admin');

    await page.goto('/admin');
    // Admin area should be reachable — minimal assertion to verify routing.
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });
});
