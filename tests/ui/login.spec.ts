import { test, expect, env } from '../../src/fixtures/test-fixtures';
import { defaultUsers } from '../../src/config/test-data';

test('@ui customer can log in from the login page', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login(
    env.CUSTOMER_EMAIL || defaultUsers.customer.email,
    env.CUSTOMER_PASSWORD || defaultUsers.customer.password
  );
  await loginPage.expectAuthenticated();
});

test('@ui home page loads and links to login', async ({ homePage, page }) => {
  await homePage.open();
  await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
});
