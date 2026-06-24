# Framework Guide

## TypeScript Concepts In Java Terms

- `interface` = Java interface
- `class` = Java class
- `type` = Java DTO or alias pattern
- `generic` = Java generic
- `async/await` = `CompletableFuture`-style asynchronous flow
- `Promise` = future-style async result
- arrow function = lambda expression
- `readonly` = `final`
- union type = either/or type, similar to overloaded method contracts
- `infer` from Zod = runtime validation plus typed model binding

## Code Examples

### Page Object

```ts
export class LoginPage extends BasePage {
  async login(email: string, password: string): Promise<void> {
    await this.fillByLabel("Email", email);
    await this.fillByLabel("Password", password);
    await this.page.getByRole("button", { name: /login/i }).click();
  }
}
```

### API Client

```ts
export class AuthApi extends BaseApiClient {
  async login(credentials: LoginRequest): Promise<AuthSession> {
    const response = await this.postJson<LoginRequest, TokenResponse>(
      "/users/login",
      credentials,
    );
    return {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
    };
  }
}
```

### Hybrid Test

```ts
test("@hybrid customer can login and continue checkout", async ({
  authApi,
  productsApi,
  productsPage,
}) => {
  const session = await authApi.login({
    email: "customer@practicesoftwaretesting.com",
    password: "welcome01",
  });
  const catalog = await productsApi.getProducts();
  expect(session.accessToken).toBeTruthy();
  expect(catalog.data.length).toBeGreaterThan(0);
  await productsPage.open();
});
```

## Best Practices

- Keep selectors semantic and stable.
- Keep test data in builders and factories.
- Keep direct HTTP calls in API clients, not in specs.
- Prefer constructor injection for reusable helpers.
- Centralize environment values and endpoint paths.
- Use tags to isolate smoke, regression, API, and visual runs.
- Make assertions on business outcomes, not internal implementation details.

## Interview Questions

1. Why would you choose a hybrid API + UI framework over pure UI automation?
2. How does the page object model reduce maintenance cost?
3. When would you use a repository instead of a service?
4. How do retries differ from flaky test masking?
5. How do you keep parallel tests isolated?
6. How would you design auth reuse across UI and API tests?
7. What belongs in a fixture versus a page object?
8. How do you make visual tests stable across browsers?

## Production Recommendations

- Run tests in containers or standardized CI agents.
- Keep environment-specific secrets in a secure vault.
- Capture traces only on retry or failure to control storage growth.
- Gate merges on smoke plus targeted regression suites.
- Publish HTML, JSON, and JUnit reports to CI artifacts.
- Refresh fixtures and test data from API contracts rather than hard-coded UI flows when possible.

## Common Mistakes

- Putting locator logic directly inside tests.
- Sharing mutable state across tests.
- Hard-coding credentials in source control.
- Mixing UI assertions with API setup logic in the same helper.
- Using brittle CSS selectors or text fragments for critical paths.
- Overusing retries to hide unstable test design.

## Performance Optimizations

- Use parallel execution by default.
- Keep test setup idempotent and API-driven.
- Avoid repeated login flows when one authenticated state can be reused safely.
- Restrict browser projects to the combinations that provide coverage value.
- Capture screenshots and traces only when needed.
- Seed data through APIs instead of the UI whenever possible.

## Refactoring Suggestions

- Extract repeated payload creation into builders.
- Move repeated checkout or login sequences into services.
- Split large page objects when they accumulate too many responsibilities.
- Introduce typed response models as the API surface evolves.
- Add contract checks for key endpoints once the team stabilizes the schema.
- Add a dedicated auth-state setup project if repeated login becomes a bottleneck.
