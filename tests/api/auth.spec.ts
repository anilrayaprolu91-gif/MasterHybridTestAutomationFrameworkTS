import { test, expect, env } from '../../src/fixtures/test-fixtures';
import { defaultUsers } from '../../src/config/test-data';

test('@api should login with customer credentials', async ({ authApi }) => {
  const session = await authApi.login({
    email: env.CUSTOMER_EMAIL || defaultUsers.customer.email,
    password: env.CUSTOMER_PASSWORD || defaultUsers.customer.password
  });

  expect(session.tokenType.toLowerCase()).toBe('bearer');
  expect(session.accessToken.length).toBeGreaterThan(10);
});

test('@api should retrieve current user profile with bearer token', async ({ authApi }) => {
  const session = await authApi.login({
    email: env.CUSTOMER_EMAIL || defaultUsers.customer.email,
    password: env.CUSTOMER_PASSWORD || defaultUsers.customer.password
  });

  const profile = await authApi.me(session.accessToken);
  expect(profile.email).toContain('@');
});
