---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::dots
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:36.007Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::dots
  line_range:
    start: 61
    end: 61
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:370d9a81f2916f2c449619415a5335a6331a1779599bcc14e8ebef858d089288
  structural:
    kind: const
    parent_scope: module
    name: dots
    index_in_parent: 15
  semantic_fingerprint: >-
    Extracts the length of a captured group from a regex match, specifically counting consecutive dot characters in
    Python import statements.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# dots

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This line extracts the length of the first capturing group from a regex match object. Based on the context (Python scanner plugin for relationship analysis), it appears to be counting the number of consecutive dots in Python import statements. This is likely used to determine the depth or type of relative imports (e.g., `from . import` vs `from .. import` vs `from ... import`), which is essential for resolving package relationships in dependency scanning.

## Inferred Design Rationale

- **Regex-based parsing:** The code uses regex matching to identify Python import patterns. (Observing: `match[1]` directly accesses the first capturing group)
- **Dot counting for relative imports:** Counting dots is a standard way to determine relative import depth in Python. (Likely: the variable name `dots` and context strongly suggest this purpose)
- **String length as metric:** Using `.length` on the captured group suggests the capture is a string of dots, making length the natural measure. (Observing: JavaScript/TypeScript syntax for string length)

## What Cannot Be Determined

- **[Regex pattern details]:** What the full regex pattern is, what it matches, and what other capturing groups exist in the match object.
- **[Usage of the `dots` variable]:** How this value is subsequently used (e.g., validation, classification, comparison against thresholds).
- **[Import syntax coverage]:** Whether this handles all Python import variations (e.g., `__future__` imports, namespace packages, PEP 420 implicit namespaces).
- **[Business logic]:** The broader purpose of the scanner plugin and how relative import depth impacts relationship resolution.
- **[Performance context]:** Whether this is in a hot path or whether regex optimization was considered.
