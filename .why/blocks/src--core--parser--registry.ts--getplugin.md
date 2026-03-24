---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/registry.ts::getPlugin
file: src/core/parser/registry.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:25.967Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/registry.ts::getPlugin
  line_range:
    start: 15
    end: 21
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:e07afbbf4d2174ba2b469d8a3cf4654c5449529147a84f3cae9f2252a3e7e08b
  structural:
    kind: function
    parent_scope: module
    name: getPlugin
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Resolves a file extension to a corresponding parser plugin by iterating through registered plugins; returns a
    generic fallback plugin if no match is found.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/parser/plugins/generic.ts::genericPlugin
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParserPlugin
    source: ai
---

# getPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function implements a plugin lookup mechanism that maps file extensions to their corresponding parser implementations. It extracts the file extension from a given file path, searches through a registry of plugins to find one that handles that extension, and returns a sensible default (genericPlugin) when no specialized handler exists. This pattern likely supports a pluggable parser architecture where different file types can be parsed by different specialized implementations.

## Inferred Design Rationale

- **Extension-based dispatch (OBSERVED):** The function uses file extension as the lookup key, which is a common, straightforward approach for routing file parsing logic. This suggests the system doesn't rely on file content inspection or MIME types.

- **Case-insensitive matching (OBSERVED):** `path.extname().toLowerCase()` normalizes extensions to lowercase before comparison. This likely handles cross-platform inconsistencies and user input variations (e.g., `.JSON` vs `.json`).

- **Linear search through plugins (OBSERVED):** The code iterates sequentially through a `plugins` array rather than using a Map or object lookup. This suggests either the plugin list is small enough that linear search is acceptable, or insertion order matters for precedence (first matching plugin wins).

- **Graceful fallback design (OBSERVED):** Returning `genericPlugin` when no specific match is found ensures the function never fails—it always returns a valid plugin. This likely prevents parsing failures from blocking the entire system.

- **Global plugin registry (INFERRED):** The `plugins` variable appears to be module-scoped and mutable, suggesting a registration pattern where plugins are added at startup or dynamically loaded.

## What Cannot Be Determined

- **[Performance expectations]:** Whether linear search performance is acceptable, or if there are known bottlenecks that would justify a Map-based lookup.

- **[Plugin registration mechanism]:** How plugins are added to the `plugins` array—whether this happens at initialization, dynamically, or through a decorator/configuration system.

- **[Fallback plugin capabilities]:** What `genericPlugin` actually does and whether it successfully parses all file types or merely degrades gracefully.

- **[Extension collision handling]:** Whether multiple plugins can claim the same extension, and if so, whether the first match or some priority system is intentional.

- **[Historical alternatives]:** Why extension-based lookup was chosen over content-based detection or MIME type matching.

- **[Business context]:** What file types are actually supported and whether the plugin registry is fixed or user-configurable.
