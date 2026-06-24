# File Catalog

## Root Files

| File                   | Why it exists                                                                     |
| ---------------------- | --------------------------------------------------------------------------------- |
| `.env.example`         | Template for environment-specific values used by the framework.                   |
| `.gitignore`           | Keeps generated reports, auth state, and node modules out of source control.      |
| `package.json`         | Defines dependencies, scripts, and the framework entry points.                    |
| `playwright.config.ts` | Central Playwright configuration for browsers, retries, reporting, and artifacts. |
| `README.md`            | High-level project guide and navigation hub.                                      |
| `tsconfig.json`        | TypeScript compiler settings for strict enterprise-grade typing.                  |

## Workspace Instructions

| File                              | Why it exists                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `.github/copilot-instructions.md` | Workspace-specific Copilot guidance for consistent generation and editing behavior. |
| `.github/workflows/ci.yml`        | CI pipeline for install, typecheck, and Playwright execution.                       |

## Configuration

| File                        | Why it exists                                       |
| --------------------------- | --------------------------------------------------- |
| `src/config/environment.ts` | Loads and validates environment variables.          |
| `src/config/endpoints.ts`   | Single source of truth for documented API routes.   |
| `src/config/test-data.ts`   | Shared default accounts and payment data for tests. |

## Core Layer

| File                          | Why it exists                          |
| ----------------------------- | -------------------------------------- |
| `src/core/base-api-client.ts` | Reusable HTTP wrapper for API clients. |
| `src/core/base-page.ts`       | Shared UI page object behavior.        |
| `src/core/logger.ts`          | Lightweight structured logging helper. |

## Setup

| File                        | Why it exists                                |
| --------------------------- | -------------------------------------------- |
| `src/setup/global-setup.ts` | Creates directories needed before tests run. |

## Models

| File                           | Why it exists                                        |
| ------------------------------ | ---------------------------------------------------- |
| `src/models/auth.model.ts`     | Login and session response contracts.                |
| `src/models/cart.model.ts`     | Cart and add-item payload contracts.                 |
| `src/models/contact.model.ts`  | Contact form request and response contracts.         |
| `src/models/invoice.model.ts`  | Invoice and payment payload contracts.               |
| `src/models/postcode.model.ts` | Postcode lookup response contract.                   |
| `src/models/product.model.ts`  | Product, brand, category, image, and spec contracts. |
| `src/models/user.model.ts`     | User request, response, and pagination contracts.    |

## API Clients

| File                        | Why it exists                                         |
| --------------------------- | ----------------------------------------------------- |
| `src/api/api-utils.ts`      | Shared helpers for auth headers and query strings.    |
| `src/api/auth-api.ts`       | Login, register, refresh, logout, and profile access. |
| `src/api/categories-api.ts` | Category catalog access and search.                   |
| `src/api/carts-api.ts`      | Cart creation and cart item management.               |
| `src/api/contact-api.ts`    | Contact message interactions.                         |
| `src/api/favorites-api.ts`  | Favorites management.                                 |
| `src/api/invoices-api.ts`   | Invoice and guest checkout API operations.            |
| `src/api/payment-api.ts`    | Payment validation endpoint wrapper.                  |
| `src/api/postcode-api.ts`   | Postcode lookup wrapper.                              |
| `src/api/products-api.ts`   | Product catalog access and search.                    |
| `src/api/reports-api.ts`    | Analytics and reporting endpoints.                    |
| `src/api/totp-api.ts`       | Two-factor setup and verification flows.              |
| `src/api/users-api.ts`      | User management and account operations.               |

## Services and Repositories

| File                                     | Why it exists                                                         |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `src/repositories/product-repository.ts` | Intent-focused access to product data.                                |
| `src/repositories/user-repository.ts`    | Intent-focused access to user data.                                   |
| `src/services/auth-service.ts`           | Higher-level auth orchestration.                                      |
| `src/services/catalog-service.ts`        | Catalog orchestration across products and categories.                 |
| `src/services/checkout-service.ts`       | Hybrid checkout orchestration across cart, payment, and invoice APIs. |

## UI Page Objects

| File                         | Why it exists                                |
| ---------------------------- | -------------------------------------------- |
| `src/pages/cart-page.ts`     | Encapsulates cart UI interactions.           |
| `src/pages/checkout-page.ts` | Encapsulates checkout UI interactions.       |
| `src/pages/home-page.ts`     | Encapsulates home page navigation.           |
| `src/pages/login-page.ts`    | Encapsulates login UI interactions.          |
| `src/pages/product-page.ts`  | Encapsulates single-product UI interactions. |
| `src/pages/products-page.ts` | Encapsulates catalog browsing interactions.  |

## Utilities

| File                        | Why it exists                                |
| --------------------------- | -------------------------------------------- |
| `src/utils/assertions.ts`   | Reusable assertions for data and API checks. |
| `src/utils/data-factory.ts` | Faker-backed builders for test data.         |
| `src/utils/screenshot.ts`   | Standardized screenshot capture helper.      |
| `src/utils/tracing.ts`      | Placeholder tracing attachment helper.       |

## Fixtures and Reporting

| File                                   | Why it exists                                         |
| -------------------------------------- | ----------------------------------------------------- |
| `src/fixtures/test-fixtures.ts`        | Dependency-injection layer for APIs and page objects. |
| `src/reporters/enterprise-reporter.ts` | Custom summary reporter for CI and local runs.        |

## Tests

| File                               | Why it exists                              |
| ---------------------------------- | ------------------------------------------ |
| `tests/api/auth.spec.ts`           | API auth examples and bearer token checks. |
| `tests/api/cart.spec.ts`           | API cart lifecycle example.                |
| `tests/api/products.spec.ts`       | API catalog retrieval and search examples. |
| `tests/hybrid/checkout.spec.ts`    | Hybrid API + UI orchestration examples.    |
| `tests/ui/login.spec.ts`           | UI login and landing page examples.        |
| `tests/ui/products.spec.ts`        | UI catalog browsing example.               |
| `tests/visual/home.visual.spec.ts` | Visual testing example.                    |

## Documentation

| File                          | Why it exists                                                           |
| ----------------------------- | ----------------------------------------------------------------------- |
| `docs/architecture.md`        | Entry point for versioned architecture documentation.                   |
| `docs/system-architecture.md` | Layered framework structure, runtime composition, and data flow.        |
| `docs/execution-sequences.md` | Sequence diagrams for authenticated, hybrid, visual, and mocking flows. |
| `docs/guide.md`               | Java-to-TypeScript mapping, best practices, and production guidance.    |
| `docs/file-catalog.md`        | This file-by-file explanation.                                          |
