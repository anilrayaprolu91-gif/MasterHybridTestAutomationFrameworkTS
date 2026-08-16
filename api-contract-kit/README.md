# Deterministic API Contract Kit

A small enterprise-style API testing layer for Playwright + TypeScript.

## Design

```text
OpenAPI schema
     |
     v
Hey API code generation
     |
     +--> typed models
     +--> generated SDK/client functions
     +--> Zod runtime schemas
     |
     v
Playwright API tests
     |
     +--> deterministic data factory
     +--> transport abstraction
     +--> fluent response assertions
     +--> contract/runtime validation
```

## Why this is deterministic

- Test data is explicit and repeatable.
- The sample API server is local and isolated per test suite.
- No dependency on a public API or current date/time.
- POST IDs are derived from the deterministic test-data name.
- Runtime response validation comes from the same OpenAPI contract used for code generation.

## Code generation

Run:

```bash
npm install
npm run codegen:api
```

The generated directory is `api-contract-kit/src/generated`.

Treat generated code as a build artifact: do not hand-edit it. Change the OpenAPI contract and regenerate instead.

## Test execution

```bash
npm run test:contract-kit
```

## Enterprise pattern

The intended production flow is:

1. Store the versioned OpenAPI contract in source control.
2. Validate the contract in CI.
3. Generate models, SDK functions and runtime schemas from the contract.
4. Keep business tests focused on intent rather than HTTP boilerplate.
5. Use the Playwright request layer for test lifecycle, tracing and reporting.
6. Validate responses with generated Zod schemas at the API boundary.
7. Never manually duplicate DTO/interface definitions when the contract is authoritative.

## Moving to a real API

Replace `api-contract-kit/openapi.yaml` with the service's OpenAPI document or point `input` in `hey-api.config.ts` to a versioned remote schema. Keep the runtime utilities and test conventions unchanged.
