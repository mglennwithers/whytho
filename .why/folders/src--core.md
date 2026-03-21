---
whytho: "1.0"
type: folder
path: src/core/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/constants.ts
  - src/core/types.ts
sessions: []
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

The `src/core/` folder serves as the **foundational type system and configuration layer** for the WHYTHO application—a code analysis, documentation, and versioning system. It provides:

1. **Centralized Constants** (`constants.ts`) — Application-wide configuration values, directory structures, versioning information, and enumeration-like constants that maintain consistency across the codebase and enable single-point updates.

2. **Type Definitions & Schemas** (`types.ts`) — A comprehensive TypeScript type system that:
   - Extracts types from runtime constants to maintain DRY principles
   - Defines data structures for core entities (code blocks, files, folders, sessions, relationships, annotations)
   - Establishes validation schemas for runtime data integrity
   - Standardizes enumerations and union types across the application

3. **Architectural Role** — Acts as the single source of truth for:
   - Type contracts used throughout the application
   - Configuration and magic strings
   - Domain entity definitions
   - Data validation rules

This folder establishes the foundation upon which higher-level modules build their functionality, ensuring type safety and consistency across the codebase.

## What Cannot Be Determined

- **Specific business logic** — How constants and types are actually used in practice
- **Runtime validation implementation details** — Whether validation uses Zod, Joi, or another schema library (only that schemas exist)
- **Performance implications** — Impact of the type system design on application performance
- **Evolution history** — How the type system has changed or why specific design decisions were made
- **Integration patterns** — How other modules import and utilize these core types and constants
- **Exact purpose of WHYTHO** — The high-level application intent beyond "code analysis and documentation"
