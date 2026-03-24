---
whytho: "1.0"
type: block
symbolic_ref: src/config/loader.ts::mergeDeep
file: src/config/loader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:23.633Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/config/loader.ts::mergeDeep
  line_range:
    start: 6
    end: 28
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:1f0a859cf126ff969289e2d8f9520c007c71ef790f06067223cc9af0fdc06f22
  structural:
    kind: function
    parent_scope: module
    name: mergeDeep
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Recursively merges two configuration objects, deeply combining nested objects while allowing override values to take
    precedence over base values, treating arrays as atomic values rather than merging them element-wise.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/config/defaults.ts::DEFAULT_CONFIG
    source: ai
---

# mergeDeep

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function implements a deep merge strategy for configuration objects, combining a `base` configuration with an `override` configuration. The override values take precedence, but nested objects are merged recursively rather than replaced wholesale. This pattern is typical in configuration management systems where users can provide partial overrides that should be layered on top of defaults while preserving unspecified nested properties.

## Inferred Design Rationale

- **Shallow copy of base before mutation** (observing: `const result = { ...base }`): Creates a new object to avoid mutating the input, suggesting immutability is valued in this codebase.

- **Recursive descent for plain objects only** (observing: nested type checks): The function distinguishes between plain objects (which should be merged) and arrays/primitives (which should be replaced). This likely reflects a common configuration pattern where arrays represent lists of items that shouldn't be merged element-wise, and primitives are terminal values.

- **Null-safe object detection** (observing: `overrideVal !== null && typeof overrideVal === 'object'`): Both values must be non-null objects to trigger recursion. This prevents attempting to merge when either value is null or undefined, which would cause errors.

- **Override wins for non-mergeable types** (inferring: `result[key] = overrideVal` in else branch): When types don't match the "both are plain objects" condition, the override value completely replaces the base value, giving override priority.

## What Cannot Be Determined

- **Performance requirements:** Whether deep merges are performance-critical or if this O(n) traversal is acceptable for the expected configuration object sizes.

- **Array merge philosophy:** Why arrays are treated as atomic values rather than merged—whether this is intentional or reflects user feedback that array merging caused bugs.

- **Circular reference handling:** The code has no protection against circular references in objects, which would cause infinite recursion. It's unclear if this is by design (configs assumed acyclic) or an oversight.

- **Business context:** What configuration system this supports (environment configs, feature flags, application settings, etc.) and how deeply nested configurations typically are.

- **Alternative approaches considered:** Whether shallow merge or different merge strategies were evaluated.

- **Undefined vs null semantics:** Whether `undefined` values in override should delete base properties or be treated the same as other values (currently they replace).
