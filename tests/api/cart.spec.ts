import { test, expect } from '../../src/fixtures/test-fixtures';

test('@api should create cart and add product', async ({ cartsApi, productsApi }) => {
  const catalog = await productsApi.getProducts();
  const product = catalog.data[0];

  expect(product).toBeTruthy();
  if (!product) {
    throw new Error('No product returned from catalog');
  }

  const cart = await cartsApi.createCart();
  const addResult = await cartsApi.addItem(cart.id, {
    product_id: product.id,
    quantity: 1
  });

  expect(addResult.result.toLowerCase()).toContain('item');
});
