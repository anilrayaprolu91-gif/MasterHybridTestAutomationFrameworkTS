import { test, expect } from '../../src/fixtures/test-fixtures';

test('@ui user can search and open a product', async ({ productsPage, page }) => {
  await productsPage.open();
  await productsPage.searchProduct('hammer');
  await productsPage.openFirstProduct();
  await expect(page.locator('h1, h2, h3').first()).toBeVisible();
});
