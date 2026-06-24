import { defineConfig, devices } from '@playwright/test';
import { loadEnvironment } from './src/config/environment';
import { CUSTOMER_AUTH_FILE, ADMIN_AUTH_FILE } from './src/config/auth-state';

const environment = loadEnvironment();
const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  ...(isCi ? { workers: 4 } : {}),
  reporter: isCi
    ? [
        ['list'],
        ['json', { outputFile: 'test-results/report.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['./src/reporters/enterprise-reporter.ts']
      ]
    : [
        ['line'],
        ['html', { open: 'never' }],
        ['./src/reporters/enterprise-reporter.ts']
      ],
  globalSetup: './src/setup/global-setup.ts',
  timeout: environment.TEST_TIMEOUT_MS,
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: environment.UI_BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    testIdAttribute: 'data-testid'
  },
  projects: [
    // -----------------------------------------------------------------------
    // Setup project — runs once before any dependent project.
    // Produces playwright/.auth/customer.json and admin.json.
    // Java equivalent: a @BeforeSuite hook.
    // -----------------------------------------------------------------------
    {
      name: 'setup',
      testMatch: /src\/setup\/auth-setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },

    // -----------------------------------------------------------------------
    // Unauthenticated cross-browser projects
    // -----------------------------------------------------------------------
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'pixel-5',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'iphone-13',
      use: { ...devices['iPhone 13'] }
    },

    // -----------------------------------------------------------------------
    // Authenticated projects — depend on the setup project.
    // The saved storageState is injected into every browser context so
    // tests start already logged in without re-running the UI login flow.
    //
    // Java equivalent: reusing an authenticated WebDriver session across tests
    // via a shared @BeforeClass fixture.
    // -----------------------------------------------------------------------
    {
      name: 'chromium-authenticated-customer',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: CUSTOMER_AUTH_FILE
      }
    },
    {
      name: 'chromium-authenticated-admin',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: ADMIN_AUTH_FILE
      }
    }
  ]
});
