/**
 * Authenticated Fixtures
 *
 * Extends the base AppApis + AppPages fixture set with:
 *   - `accessToken`   — the current user's JWT, obtained once per test via API
 *                       login, so the token is always fresh even when the
 *                       browser storage state is loaded from a cached file.
 *   - `adminToken`    — the same but for the admin account.
 *
 * Tests that need a logged-in browser AND a bearer token can import `authTest`
 * instead of the base `test`:
 *
 *   import { authTest as test, expect } from '@src/fixtures/authenticated-fixtures';
 *
 * Java equivalent: a base test class whose @Before method injects an
 * authenticated WebDriver and an HTTP-client session into each test instance.
 *
 * The browser context storage state is loaded from the file produced by the
 * setup project (src/setup/auth-setup.ts).  Playwright injects it automatically
 * when the project uses `use.storageState`.  The token fixture is only
 * needed when the test also wants to make raw API calls.
 */

import { request as playwrightRequest } from '@playwright/test';
import { loadEnvironment } from '../config/environment';
import { AuthApi } from '../api/auth-api';

// Re-export the base fixtures so consumers can import from one place.
export { test as baseTest, expect } from './test-fixtures';

const env = loadEnvironment();

// ---------------------------------------------------------------------------
// Extra fixture types
// ---------------------------------------------------------------------------
export type AuthFixtures = {
  /** Bearer token for the customer account — freshly obtained per test. */
  accessToken: string;
  /** Bearer token for the admin account — freshly obtained per test. */
  adminToken: string;
};

// ---------------------------------------------------------------------------
// Extend
// ---------------------------------------------------------------------------
import { test as appTest } from './test-fixtures';

export const authTest = appTest.extend<AuthFixtures>({
  /**
   * TypeScript: fixture returning a plain `string` value.
   * Java equivalent: a field populated by @BeforeMethod.
   */
  accessToken: async ({ correlationId }, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: env.API_BASE_URL
    });
    const authApi = new AuthApi(apiContext, { correlationId });
    const session = await authApi.login({
      email: env.CUSTOMER_EMAIL,
      password: env.CUSTOMER_PASSWORD
    });
    await use(session.accessToken);
    await apiContext.dispose();
  },

  adminToken: async ({ correlationId }, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: env.API_BASE_URL
    });
    const authApi = new AuthApi(apiContext, { correlationId });
    
    const session = await authApi.login({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD
    });

    await use(session.accessToken);
    await apiContext.dispose();
  }
});

export { authTest as test };
