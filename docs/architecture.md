# Architecture

## Live Documentation

- This page is the entry point for the versioned architecture docs.
- Mermaid blocks render in VS Code Markdown Preview and most Git hosting viewers, so the diagrams stay versioned with the code.
- Keep the linked documents aligned with fixture wiring, page objects, service orchestration, storage-state setup, and validated runtime flows.

## Documents

- [System architecture](system-architecture.md): framework layers, runtime composition, component inventory, and data flow.
- [Execution sequences](execution-sequences.md): representative Mermaid sequence diagrams for authenticated, hybrid, visual, and mocking workflows.

## Update Checklist

- Update [system-architecture.md](system-architecture.md) when you change fixtures, page objects, services, repositories, setup flow, or API surface.
- Update [execution-sequences.md](execution-sequences.md) when you change UI flows, API seeding, authenticated behavior, visual checks, or request-mocking behavior.
- Update [file-catalog.md](file-catalog.md) and [README.md](..\README.md) if the documentation set is renamed or expanded.

## Recommended Review Pattern

- Start with [system-architecture.md](system-architecture.md) when reviewing framework structure.
- Use [execution-sequences.md](execution-sequences.md) when reviewing runtime behavior or explaining test flow to contributors.
- Keep diagrams in the same pull request as the code that changes the behavior they describe.
