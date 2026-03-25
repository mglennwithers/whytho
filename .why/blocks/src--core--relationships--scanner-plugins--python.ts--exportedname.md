---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::exportedName
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:36.025Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::exportedName
  line_range:
    start: 72
    end: 72
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:79b8844d4cfa4a2f198217610e692252fbcfa6eecdacd8eb1349a196148d000e
  structural:
    kind: const
    parent_scope: module
    name: exportedName
    index_in_parent: 22
  semantic_fingerprint: >-
    Extracts the first capture group from a regex match result to obtain an exported identifier name, likely from a
    Python module export statement.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# exportedName

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This block extracts a captured string from a regex match operation. Given the filename context (python.ts in a relationships/scanner-plugins directory), this appears to extract the name of an exported Python symbol from a matched pattern. The code is part of a larger analysis pipeline that identifies relationships between Python modules and their exports.

## Inferred Design Rationale

- **Regex capture group extraction:** The code assumes `nameMatch` is a non-null array (from a successful regex match), and accesses index `[1]` to get the first capture group rather than the full match at `[0]`. (Observing: this is standard regex extraction syntax)

- **Named variable assignment:** The result is stored in `exportedName` with a semantic name that clarifies intent, rather than using it inline. (Inferring: this suggests the extracted name will be used multiple times or needs to be passed to subsequent processing steps)

- **Position in a scanning pipeline:** This appears to be part of iterative pattern matching over Python source code. (Inferring: the broader context of a "scanner-plugins" suggests this processes multiple matches in sequence)

## What Cannot Be Determined

- **[Regex pattern source]:** What regex pattern created `nameMatch` is unknown—could be matching `__all__` exports, `from X import Y` statements, or function/class definitions.

- **[Validation logic]:** Whether `nameMatch` is guaranteed to have at least 2 elements (match + group) or if null/undefined checks occur elsewhere.

- **[Export context type]:** Whether this extracts explicit exports (like `__all__` entries), implicit module exports (all top-level names), or specific import statements.

- **[Subsequent processing]:** How `exportedName` is used downstream—whether it's stored, filtered, transformed, or passed to another scanning phase.

- **[Python version/dialect support]:** Whether this handles all Python export patterns or targets specific syntax conventions.
