---
whytho: "1.0"
type: file
path: src/config/loader.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/config/
sessions: []
blocks:
  - src/config/loader.ts::mergeDeep
  - src/config/loader.ts::result
  - src/config/loader.ts::key
  - src/config/loader.ts::baseVal
  - src/config/loader.ts::overrideVal
  - src/config/loader.ts::loadConfig
  - src/config/loader.ts::configFile
  - src/config/loader.ts::raw
  - src/config/loader.ts::parsed
  - src/config/loader.ts::pkgFile
  - src/config/loader.ts::raw
  - src/config/loader.ts::pkg
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/config/defaults.ts::DEFAULT_CONFIG
    source: static
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements a configuration loading system for the "whytho" project. It provides:

1. **`mergeDeep()` function** — Recursively merges override configuration objects into base/default configuration, allowing partial user overrides while preserving unspecified nested properties.

2. **`loadConfig()` function** — The primary export that implements a tiered configuration discovery strategy:
   - First attempts to load `whytho.config.json` from the repository root
   - Falls back to reading a `whytho` field from `package.json` if the dedicated config file doesn't exist
   - Returns default configuration if neither source is found
   - Merges discovered configuration with defaults using `mergeDeep()`

The file serves as the configuration initialization layer for the application, giving users flexible options (dedicated config file, package.json field, or defaults) for specifying project settings while ensuring sensible fallbacks are always available.

## What Cannot Be Determined

- The **structure and schema of the default configuration object** — what keys/fields are expected
- **Where `repoRoot` originates** — whether it's passed as a parameter, imported from elsewhere, or determined at runtime
- **Error handling strategy** — whether missing files throw errors or are silently ignored (try-catch blocks not visible in annotations)
- **How this config is consumed** — which modules depend on `loadConfig()` and how they use the returned configuration
- **Performance implications** — whether the async file reads cause bottlenecks in initialization
- **Type definitions** — the precise TypeScript interfaces for configuration objects beyond `Record<string, unknown>`
