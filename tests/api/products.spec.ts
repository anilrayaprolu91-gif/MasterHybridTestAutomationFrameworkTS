import { test, expect } from '../../src/fixtures/test-fixtures';
import { expectArrayNotEmpty } from '../../src/utils/assertions';

test('@api should retrieve catalog products', async ({ productsApi }) => {
  const catalog = await productsApi.getProducts();

  await expectArrayNotEmpty(catalog.data);
  expect(catalog.current_page).toBeGreaterThan(0);
});

test('@api should search products by keyword', async ({ productsApi }) => {
  const catalog = await productsApi.searchProducts('hammer');

  await expectArrayNotEmpty(catalog.data);
  expect(catalog.data.some((product) => product.name.toLowerCase().includes('hammer'))).toBeTruthy();
});
