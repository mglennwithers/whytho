---
whytho: "1.0"
type: folder
path: src/config/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/config/defaults.ts
  - src/config/loader.ts
  - src/config/tracking.ts
  - src/config/types.ts
sessions: []
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

The `src/config/` folder is a **configuration management system** for the Whytho code annotation tool. It handles:

1. **Type definitions** (`types.ts`) — Establishes TypeScript interfaces and constrained types for the entire configuration schema, including verbosity levels, file patterns, and API settings

2. **Default values** (`defaults.ts`) — Provides baseline configuration across all settings (AI models, output formats, file filtering, API endpoints) used during initial setup and as fallback values

3. **Configuration loading** (`loader.ts`) — Implements a tiered discovery and merge strategy that:
   - Loads user configuration from `whytho.config.json` or `package.json`
   - Merges partial user overrides with defaults via recursive deep merging
   - Provides a unified `loadConfig()` entry point

4. **File tracking filters** (`tracking.ts`) — Defines which files and directories are included/excluded from analysis via:
   - Hardcoded skip lists (node_modules, build artifacts, etc.)
   - Dynamic filtering functions for normalized path checking

**Architectural role**: Central configuration hub that abstracts all user-facing settings, providing type safety, sensible defaults, and flexible override mechanisms.

## What Cannot Be Determined

- Specific default values (AI model names, API endpoints, threshold numbers)
- Complete list of supported configuration options beyond type hints
- Whether configuration is environment-specific (dev/prod/test)
- How configuration errors are handled (validation, error reporting)
- Whether there's a schema validation layer beyond TypeScript types
- Integration points with other modules that consume this configuration
