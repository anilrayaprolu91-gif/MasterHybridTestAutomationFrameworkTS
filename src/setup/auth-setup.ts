/**
 * Auth Setup — Playwright setup project
 *
 * This spec runs once per suite before any project that declares
 * `dependencies: ['setup']`. It logs in via the REST API (no UI interaction),
 * injects the JWT into the browser's localStorage so the Angular front-end
 * treats the session as authenticated, then saves the resulting
 * storageState to disk.
 *
 * Java equivalent: a @BeforeSuite hook that creates a shared
 * authenticated WebDriver / HTTP-client context stored as a class field.
 *
 * The saved state files are intentionally excluded from source control
 * via .gitignore — they are transient CI/local artefacts.
 */

import { test as setup } from '@playwright/test';
import { loadEnvironment } from '../config/environment';
import { AuthApi } from '../api/auth-api';
import { CUSTOMER_AUTH_FILE, ADMIN_AUTH_FILE } from '../config/auth-state';

const env = loadEnvironment();

// ---------------------------------------------------------------------------
// Customer login
// ---------------------------------------------------------------------------
setup('authenticate as customer', async ({ page, request }) => {
  const authApi = new AuthApi(request);
  const session = await authApi.login({
    email: env.CUSTOMER_EMAIL,
    password: env.CUSTOMER_PASSWORD
  });

  // Navigate to the app so the origin exists before we write localStorage.
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Inject the JWT so subsequent page navigations appear authenticated.
  await page.evaluate(
    ({ token, tokenType }) => {
      window.localStorage.setItem('access_token', token);
      window.localStorage.setItem('token_type', tokenType);
    },
    { token: session.accessToken, tokenType: session.tokenType }
  );

  // Persist storage state (cookies + localStorage) for test reuse.
  await page.context().storageState({ path: CUSTOMER_AUTH_FILE });
});

// ---------------------------------------------------------------------------
// Admin login
// ---------------------------------------------------------------------------
setup('authenticate as admin', async ({ page, request }) => {
  const authApi = new AuthApi(request);
  const session = await authApi.login({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD
  });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  await page.evaluate(
    ({ token, tokenType }) => {
      window.localStorage.setItem('access_token', token);
      window.localStorage.setItem('token_type', tokenType);
    },
    { token: session.accessToken, tokenType: session.tokenType }
  );

  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});
