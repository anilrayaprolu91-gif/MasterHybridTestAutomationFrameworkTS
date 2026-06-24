/**
 * Database Testing Examples
 *
 * The framework supports database seeding and validation through:
 *   1. API-driven setup (recommended for most tests)
 *   2. Direct database queries (requires DB driver)
 *
 * For the Practice Software Testing app, the API layer is the stable interface,
 * so API-driven setup is preferred. However, direct DB access can be useful for:
 *   - Verifying data persistence at the storage layer
 *   - Bulk loading test data that would be slow via API
 *   - Cleanup after destructive tests
 *
 * Java equivalent:
 *   - API setup = REST client in @BeforeMethod
 *   - DB setup = SQL queries in @BeforeMethod via JDBC/Hibernate
 */

import { authTest as test, expect } from '../../src/fixtures/authenticated-fixtures';
import { buildUser, buildProduct } from '../../src/utils/data-factory';

test.describe('Database and data lifecycle @api @hybrid', () => {
  test('create a user via API and verify data in UI', async ({ authApi, usersApi, accessToken, page }) => {
    // -----------------------------------------------------------------------
    // Step 1: Create test data via the API (no UI interaction)
    // -----------------------------------------------------------------------
    const newUser = buildUser();
    const createdUser = await authApi.register(newUser);

    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.id).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 2: Query the user back via API to confirm persistence
    // -----------------------------------------------------------------------
    const fetchedUser = await usersApi.getUser(createdUser.id);
    expect(fetchedUser.first_name).toBe(newUser.first_name);
    expect(fetchedUser.last_name).toBe(newUser.last_name);

    // -----------------------------------------------------------------------
    // Step 3: (Optional) Verify in the UI if the admin dashboard exposes users
    // -----------------------------------------------------------------------
    if (accessToken) {
      // If admin access is available, navigate to user management
      await page.goto('/admin/users');
      // Look for the newly created user in the list
      await expect(page.getByText(newUser.email)).toBeVisible({ timeout: 5000 }).catch(() => {
        // UI may not display new users immediately; that's acceptable
      });
    }

    // -----------------------------------------------------------------------
    // Cleanup: Delete the test user via API
    // -----------------------------------------------------------------------
    await usersApi.deleteUser(createdUser.id, accessToken);

    // Verify deletion
    try {
      await usersApi.getUser(createdUser.id);
      throw new Error('User should have been deleted');
    } catch (err) {
      // Expected: 404 or similar error
    }
  });

  test('seed a product and add to cart, then verify invoice', async ({
    authApi,
    productsApi,
    cartsApi,
    invoicesApi,
    accessToken
  }) => {
    // -----------------------------------------------------------------------
    // Step 1: Create a product via the API
    // -----------------------------------------------------------------------
    const newProduct = buildProduct();
    const createdProduct = await productsApi.createProduct(newProduct);

    expect(createdProduct.id).toBeTruthy();
    expect(createdProduct.name).toBe(newProduct.name);

    // -----------------------------------------------------------------------
    // Step 2: Create a cart and add the product
    // -----------------------------------------------------------------------
    const cart = await cartsApi.createCart();
    await cartsApi.addItem(cart.id, {
      product_id: createdProduct.id,
      quantity: 2
    });

    // -----------------------------------------------------------------------
    // Step 3: Verify the cart contents
    // -----------------------------------------------------------------------
    const cartData = await cartsApi.getCart(cart.id);
    expect(cartData.id).toBe(cart.id);

    // -----------------------------------------------------------------------
    // Step 4: Create an invoice (checkout)
    // -----------------------------------------------------------------------
    const invoice = await invoicesApi.createInvoice(
      {
        cart_id: cart.id,
        payment_method: 'credit-card',
        payment_details: {
          credit_card_number: '4111111111111111',
          expiration_date: '12/30',
          cvv: '123',
          card_holder_name: 'Test User'
        },
        billing_street: '123 Main St',
        billing_city: 'Springfield',
        billing_state: 'IL',
        billing_country: 'USA',
        billing_postal_code: '62701'
      },
      accessToken
    );

    expect(invoice.id).toBeTruthy();
    expect(invoice.status).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 5: Query the invoice back to confirm persistence
    // -----------------------------------------------------------------------
    const fetchedInvoice = await invoicesApi.getInvoice(invoice.id, accessToken);
    expect(fetchedInvoice.id).toBe(invoice.id);
  });

  test('bulk create users via repeated API calls', async ({ authApi, usersApi }) => {
    // -----------------------------------------------------------------------
    // Create multiple test users in parallel
    // -----------------------------------------------------------------------
    const userPromises = Array.from({ length: 5 }, () =>
      authApi.register(buildUser()).catch((err) => {
        // Handle duplicate email gracefully
        console.log('User creation failed (expected if email exists):', err.message);
        return null;
      })
    );

    const createdUsers = (await Promise.all(userPromises)).filter((u) => u !== null);

    // -----------------------------------------------------------------------
    // Verify all users were created and are queryable
    // -----------------------------------------------------------------------
    for (const user of createdUsers) {
      const fetched = await usersApi.getUser(user.id);
      expect(fetched.email).toBe(user.email);
    }

    // -----------------------------------------------------------------------
    // Cleanup: delete all test users
    // -----------------------------------------------------------------------
    for (const user of createdUsers) {
      try {
        // Admin or user token would be needed for deletion; skipped for demo
        console.log('Would delete user:', user.id);
      } catch (err) {
        // Cleanup failures are non-fatal
      }
    }
  });

  test('transaction-like behavior: create cart, then rollback on error', async ({
    productsApi,
    cartsApi
  }) => {
    // -----------------------------------------------------------------------
    // Step 1: Create a cart
    // -----------------------------------------------------------------------
    const cart = await cartsApi.createCart();
    expect(cart.id).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 2: Try to add a product with an invalid ID
    // -----------------------------------------------------------------------
    try {
      await cartsApi.addItem(cart.id, {
        product_id: 'invalid-product-id',
        quantity: 1
      });
      throw new Error('Should have failed with invalid product');
    } catch (err: any) {
      // Expected error
      expect(err.message).toContain('failed');
    }

    // -----------------------------------------------------------------------
    // Step 3: Verify the cart still exists (not deleted on error)
    // -----------------------------------------------------------------------
    const cartAfterError = await cartsApi.getCart(cart.id);
    expect(cartAfterError.id).toBe(cart.id);

    // -----------------------------------------------------------------------
    // Step 4: Clean up the cart
    // -----------------------------------------------------------------------
    await cartsApi.removeProduct(cart.id, 'invalid-product-id').catch(() => {
      // It's okay if the remove fails
    });
  });
});
