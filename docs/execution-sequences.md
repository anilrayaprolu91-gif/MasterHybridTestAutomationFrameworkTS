# Execution Sequences

## Live Documentation

- This document captures representative runtime sequences for the suite.
- Update it when UI workflows, authenticated setup behavior, hybrid orchestration, visual checks, or request-mocking patterns change.

## Generic Runtime Flow

```mermaid
sequenceDiagram
  participant Spec as Spec
  participant Fixture as Fixture Layer
  participant Api as API Client
  participant Page as Page Object
  participant App as Practice Software Testing

  Spec->>Fixture: request page or service
  Fixture->>Api: create client
  Fixture->>Page: create page object
  Spec->>Api: seed data or authenticate
  Spec->>Page: drive UI workflow
  Page->>App: user interaction
  Api->>App: REST request
  App-->>Spec: response or UI state
```

## Authenticated Favorites Flow

Representative test: `tests/ui/authenticated.spec.ts`.

```mermaid
sequenceDiagram
  participant Test as Authenticated Hybrid Test
  participant Fixture as authenticated-fixtures
  participant Products as ProductsApi
  participant Favorites as FavoritesApi
  participant Browser as Browser Page
  participant Backend as External API

  Test->>Fixture: request page, accessToken, productsApi, favoritesApi
  Fixture-->>Test: inject authenticated browser + fresh access token

  Test->>Products: getProducts()
  Products->>Backend: GET /products
  Backend-->>Products: catalog payload
  Products-->>Test: first product

  Test->>Favorites: addFavorite(product.id, accessToken)
  Favorites->>Backend: POST /favorites
  Backend-->>Favorites: favorite record
  Favorites-->>Test: favorite id + product id

  Test->>Browser: goto /account/favorites
  Browser->>Backend: fetch favorites UI data
  Backend-->>Browser: favorites view data
  Browser-->>Test: product name visible in UI

  Test->>Favorites: deleteFavorite(favorite.id, accessToken)
  Favorites->>Backend: DELETE /favorites/:id
  Backend-->>Favorites: delete success
```

## Checkout Seeded Flow

Representative test: `tests/hybrid/checkout.spec.ts`.

```mermaid
sequenceDiagram
  participant Test as Hybrid Checkout Test
  participant Products as ProductsApi
  participant Carts as CartsApi
  participant Page as Playwright Page
  participant Checkout as CheckoutPage
  participant Backend as External API

  Test->>Products: getProducts()
  Products->>Backend: GET /products
  Backend-->>Products: catalog response
  Products-->>Test: first product

  Test->>Carts: createCart()
  Carts->>Backend: POST /carts
  Backend-->>Carts: cart id

  Test->>Carts: addItem(cart.id, product.id, quantity=1)
  Carts->>Backend: POST /carts/:id
  Backend-->>Carts: updated cart state

  Test->>Page: goto /checkout
  Test->>Checkout: fillShippingAddress(...)
  Test->>Checkout: fillPaymentDetails(...)
  Checkout->>Page: populate shipping and card form controls
  Page-->>Test: checkout UI ready for final order submission
```

## Request Mocking Flow

Representative test group: `tests/ui/mocking.spec.ts`.

```mermaid
sequenceDiagram
  participant Test as Mocking Test
  participant Browser as Playwright Page
  participant Route as page.route interceptor
  participant App as Frontend App
  participant Backend as External API
  participant ThirdParty as Analytics / Third Party

  Test->>Browser: register route handlers
  Test->>Browser: goto target page
  Browser->>App: load route and start UI requests

  alt Slow product API simulation
    App->>Route: GET /api/products
    Route->>Backend: fetch real response
    Backend-->>Route: product payload
    Route-->>App: delayed continuation
    App-->>Browser: loading spinner then products
  else Product API error simulation
    App->>Route: GET /api/products
    Route-->>App: abort request
    App-->>Browser: error or fallback UI state
  else Mocked product detail
    App->>Route: GET /api/products/mock-123
    Route-->>App: fulfill canned JSON response
    App-->>Browser: mocked product rendered
  else Block analytics
    App->>ThirdParty: analytics script/request
    Browser->>Route: intercept analytics domain
    Route-->>ThirdParty: abort request
    App-->>Browser: faster page load without analytics
  else Mocked login
    App->>Route: POST /users/login
    Route-->>App: fulfill canned bearer token
    App-->>Browser: token written to localStorage
  end
```

## Visual Regression Flow

Representative test: `tests/visual/home.visual.spec.ts`.

```mermaid
sequenceDiagram
  participant Test as Visual Test
  participant Home as HomePage
  participant Browser as Browser Page
  participant Baseline as Screenshot Baseline

  Test->>Home: open()
  Home->>Browser: goto /
  Browser-->>Test: page rendered
  Test->>Browser: toHaveScreenshot(home-page.png)
  Browser->>Baseline: compare current render to baseline image
  Baseline-->>Test: visual match or diff
```
