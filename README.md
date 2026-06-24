# Master Hybrid Test Automation Framework TS

Enterprise-grade Playwright automation framework for UI, API, hybrid, and visual testing against Practice Software Testing.

## Application Under Test

- UI: https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com
- Swagger: https://api.practicesoftwaretesting.com/api/documentation

## What This Framework Covers

- UI automation
- API automation
- Hybrid API + UI workflows
- Visual testing
- Cross-browser execution
- Mobile emulation
- Parallel execution
- Retry support
- Tag-based execution
- Screenshot, video, and trace capture
- Custom reporting
- Environment-based configuration

## Quick Start

1. Copy `.env.example` to `.env` and adjust values if required.
2. Run `npm install`.
3. Run `npm run typecheck`.
4. Run `npm test`.

## Common Commands

- `npm test` runs the full suite.
- `npm run test:ui` runs UI tests only.
- `npm run test:api` runs API tests only.
- `npm run test:hybrid` runs hybrid tests only.
- `npm run test:visual` runs visual tests only.
- `npm run test:headed` runs headed browser sessions.
- `npm run test:debug` starts Playwright debug mode.
- `npm run report` opens the HTML report.
- `npm run typecheck` validates the TypeScript sources.

## Folder Structure

See [docs/file-catalog.md](docs/file-catalog.md) for the complete file-by-file explanation.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the architecture documentation index.

- [docs/system-architecture.md](docs/system-architecture.md) covers layers, runtime composition, component inventory, and data flow.
- [docs/execution-sequences.md](docs/execution-sequences.md) covers Mermaid sequence diagrams for authenticated, hybrid, visual, and request-mocking flows.

For a complete end-to-end execution and feature usage reference, see [docs/complete-architecture-and-execution-guide.md](docs/complete-architecture-and-execution-guide.md).

## Java to TypeScript Mapping

See [docs/guide.md](docs/guide.md) for TypeScript concepts explained in Java terms, plus best practices and production guidance.

## Framework Notes

- API routes are centralized in `src/config/endpoints.ts`.
- Environment values are validated in `src/config/environment.ts`.
- UI interactions are encapsulated in page objects under `src/pages`.
- API interactions are encapsulated in clients under `src/api`.
- Hybrid orchestration lives in services under `src/services`.

## Execution Tags

Use these tags in test names for targeted runs:

- `@ui`
- `@api`
- `@hybrid`
- `@visual`

## Enterprise Standards

This scaffold favors:

- SOLID design
- DRY, KISS, and single-responsibility code
- Dependency injection through fixtures and constructors
- Reusable service, repository, and client layers
- CI-friendly configuration
- Clear separation between test intent and implementation detail

## Notes

- The sample selectors are intentionally conservative and may need small alignment if the UI changes.
- The API client is aligned to the documented Swagger routes for the demo application.
