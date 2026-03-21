---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::WHY_DIR
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.492Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.65
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::WHY_DIR
  line_range:
    start: 4
    end: 4
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:b52364a5ae72dc10600edc5850f086e4287912f19f916f871056f7d6f79c9ef1
  structural:
    kind: const
    parent_scope: module
    name: WHY_DIR
    index_in_parent: 2
  semantic_fingerprint: >-
    Defines a constant string literal `.why` that appears to reference a directory name used somewhere in the
    application's file system operations or configuration management.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# WHY_DIR

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **65%**

## Purpose

This block exports a constant that defines a directory name as `.why`. Based on the naming pattern (dot-prefixed, all lowercase), this likely represents a hidden directory (in Unix/Linux conventions) or a configuration/cache directory that the application creates or references. The constant is exported, suggesting it's used across multiple modules in the codebase to maintain a single source of truth for this directory path.

## Inferred Design Rationale

- **String constant export:** Exporting this as a named constant (rather than hardcoding `.why` throughout the codebase) [observed] follows the DRY principle and makes future changes to the directory name centralized and maintainable.

- **Dot-prefixed naming:** The `.why` prefix [observed] likely follows Unix conventions for hidden/private directories, suggesting the directory contains internal application data, configuration, cache, or metadata that end-users shouldn't typically interact with directly.

- **Placement in constants.ts:** This location [observed] indicates it's part of a constants module, suggesting the project maintains a dedicated file for application-wide constants, improving discoverability and organization.

## What Cannot Be Determined

- **[Purpose/Context]:** What specific functionality this directory serves—whether it's for caching, logging, state persistence, analysis artifacts, or something else entirely.

- **[Naming Origin]:** Why the directory is named `.why` specifically. This could be an acronym, abbreviation, or reference to a feature that cannot be inferred from the code alone.

- **[Usage Pattern]:** How many places in the codebase actually reference this constant, or whether it's used for reading, writing, or both.

- **[Directory Structure]:** Whether subdirectories or specific files are expected within this directory.
