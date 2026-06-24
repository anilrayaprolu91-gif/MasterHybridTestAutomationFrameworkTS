/**
 * Multi-Window and Context Switching Examples
 *
 * Playwright supports:
 *   - Multiple pages within one context (shared cookies/storage)
 *   - Multiple contexts within one browser (isolated cookies/storage)
 *   - Multiple browsers running in parallel
 *
 * Java equivalent:
 *   - Multiple pages = multiple WebDriver windows with shared session
 *   - Multiple contexts = multiple WebDriver instances with isolated sessions
 *   - Multiple browsers = parallel WebDriver instances
 */

import { authTest as test, expect } from '../../src/fixtures/authenticated-fixtures';

test.describe('Multi-window and context switching @ui', () => {
  test('user can open a new tab and switch between windows', async ({ page }) => {
    // -----------------------------------------------------------------------
    // Open the first page
    // -----------------------------------------------------------------------
    await page.goto('/');
    const heading1 = page.getByRole('heading').first();
    await expect(heading1).toBeVisible();

    // -----------------------------------------------------------------------
    // Open a second page (tab) within the same context
    // All cookies/localStorage are shared because they're in one context.
    // -----------------------------------------------------------------------
    const page2 = await page.context().newPage();

    // Navigate to products
    await page2.goto('/products');
    const heading2 = page2.getByRole('heading').first();
    await expect(heading2).toBeVisible();

    // -----------------------------------------------------------------------
    // Switch back to the first page
    // -----------------------------------------------------------------------
    await page.bringToFront();
    await expect(page.getByRole('heading').first()).toBeVisible();

    // -----------------------------------------------------------------------
    // Switch to the second page
    // -----------------------------------------------------------------------
    await page2.bringToFront();
    const productHeading = page2.getByRole('heading', { name: /product/i });
    await expect(productHeading).toBeVisible();

    // Cleanup
    await page2.close();
  });

  test('two isolated contexts do NOT share cookies (separate login sessions)', async ({ browser }) => {
    // -----------------------------------------------------------------------
    // Create two isolated browser contexts
    // Each has its own cookies and localStorage.
    // -----------------------------------------------------------------------
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // -----------------------------------------------------------------------
    // In context 1, set a localStorage value
    // -----------------------------------------------------------------------
    await page1.goto('/');
    await page1.evaluate(() => {
      window.localStorage.setItem('testKey', 'value1');
    });

    const value1 = await page1.evaluate(() => window.localStorage.getItem('testKey'));
    expect(value1).toBe('value1');

    // -----------------------------------------------------------------------
    // In context 2, the same key does NOT exist (isolated storage)
    // -----------------------------------------------------------------------
    await page2.goto('/');
    const value2 = await page2.evaluate(() => window.localStorage.getItem('testKey'));
    expect(value2).toBeNull();

    // Cleanup
    await context1.close();
    await context2.close();
  });

  test('user logs in on page1, then opens page2 in same context (shares cookies)', async ({
    page,
    accessToken,
    authApi
  }) => {
    // -----------------------------------------------------------------------
    // Page 1: authenticated via storage state (from the project config)
    // -----------------------------------------------------------------------
    await page.goto('/account');
    await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();

    // -----------------------------------------------------------------------
    // Page 2: new tab in the SAME context
    // Same cookies/localStorage, so also authenticated
    // -----------------------------------------------------------------------
    const page2 = await page.context().newPage();
    await page2.goto('/account');
    // Should be logged in already, no redirect to login
    await expect(page2.getByRole('link', { name: /logout/i })).toBeVisible();

    // Verify both pages can access the authenticated API
    const profile1 = await authApi.me(accessToken);
    const profile2 = await authApi.me(accessToken);
    expect(profile1.email).toBe(profile2.email);

    await page2.close();
  });
});
