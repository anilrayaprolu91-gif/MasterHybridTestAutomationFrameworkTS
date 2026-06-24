import { test, expect, env } from '../../src/fixtures/test-fixtures';
import { defaultUsers, hybridPaymentDefaults } from '../../src/config/test-data';

test('@hybrid API seeds product data and UI validates the catalog', async ({ authApi, productsApi, productsPage }) => {
  const session = await authApi.login({
    email: env.CUSTOMER_EMAIL || defaultUsers.customer.email,
    password: env.CUSTOMER_PASSWORD || defaultUsers.customer.password
  });

  const catalog = await productsApi.getProducts();
  const product = catalog.data[0];

  expect(session.accessToken).toBeTruthy();
  if (!product) {
    throw new Error('No product returned from catalog');
  }

  expect(product.name.length).toBeGreaterThan(0);

  await productsPage.open();
  await productsPage.searchProduct(product.name.split(' ')[0] ?? product.name);
});

test('@hybrid API prepares a cart payload and UI can continue checkout', async ({ cartsApi, productsApi, checkoutPage, page }) => {
  const catalog = await productsApi.getProducts();
  const product = catalog.data[0];
  if (!product) {
    throw new Error('No product returned from catalog');
  }
  const cart = await cartsApi.createCart();
  await cartsApi.addItem(cart.id, { product_id: product.id, quantity: 1 });

  await page.goto('/checkout');
  await checkoutPage.fillShippingAddress({
    street: '123 Test Street',
    city: 'Sydney',
    state: 'NSW',
    country: 'Australia',
    postalCode: '2000'
  });
  await checkoutPage.fillPaymentDetails({
    cardNumber: hybridPaymentDefaults.paymentDetails.credit_card_number,
    expirationDate: hybridPaymentDefaults.paymentDetails.expiration_date,
    cvv: hybridPaymentDefaults.paymentDetails.cvv,
    cardHolderName: hybridPaymentDefaults.paymentDetails.card_holder_name
  });
});
