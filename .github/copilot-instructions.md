# Copilot Workspace Instructions

This repository is a Playwright TypeScript automation framework for UI, API, and hybrid testing.

## Core guidance
- Use Playwright Test APIs and TypeScript strict mode.
- Prefer reusable framework layers over test-only helpers.
- Keep the architecture aligned to enterprise patterns: page objects, API clients, services, repositories, factories, and fixtures.
- Use the documented application endpoints from the Practice Software Testing Swagger API.
- Keep selectors resilient and prefer role, label, placeholder, and test id locators.
- Use the default accounts and endpoints documented in the repository docs.

## Project conventions
- UI base URL: https://practicesoftwaretesting.com
- API base URL: https://api.practicesoftwaretesting.com
- Use `@ui`, `@api`, `@hybrid`, and `@visual` tags for execution targeting.
- Favor explicit types, small methods, and single-responsibility classes.
- Explain TypeScript concepts in Java-equivalent terms in documentation.

## Operational notes
- Validate with `npm run typecheck` and `npm run test` when dependencies are installed.
- Use the repository docs before changing architecture or endpoint mappings.
