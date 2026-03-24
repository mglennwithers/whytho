---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::candidate
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::candidate
  line_range:
    start: 28
    end: 28
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:cbd15d7cb90a5177b4fc30af0615338ddc6cb10af4094c23d18c453f13092550
  structural:
    kind: const
    parent_scope: module
    name: candidate
    index_in_parent: 4
  semantic_fingerprint: >-
    Constructs a Python module file path by appending the '.py' extension to a module path string, likely for resolving
    Python source files during dependency scanning.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# candidate

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block creates a candidate file path for a Python module by concatenating a module path with the '.py' file extension. Given the file location (`scanner-plugins/python.ts`) and variable name `candidate`, this likely exists within logic that scans Python project dependencies and attempts to locate actual module files on disk by testing potential file paths.

## Inferred Design Rationale

- **String concatenation approach:** The code uses simple string concatenation (`+`) rather than path utilities, which (observing) is a straightforward but potentially cross-platform-sensitive approach. This suggests either: (a) the code already normalizes paths before this point, or (b) this is part of a larger scanning loop that tries multiple candidate formats.

- **File extension hardcoding:** The '.py' extension is hardcoded rather than configurable, which (inferring) likely reflects that standard Python modules use this extension. This suggests the scanner is designed specifically for standard Python source files rather than bytecode or other variants.

- **Variable naming as "candidate":** The name suggests this represents one possible path in a set of attempts (inferring), implying the surrounding code probably tests multiple candidates or has fallback logic.

## What Cannot Be Determined

- **[Context of use]:** Whether this `candidate` is used in a filesystem existence check, passed to a resolver function, added to a collection of paths, or logged for debugging purposes.

- **[Module path origin]:** How `modulePath` is constructed, normalized, or validated before reaching this line—whether it includes leading slashes, uses forward or backslashes, or contains nested directory separators.

- **[Scope handling]:** Whether this handles only top-level modules or also namespaced packages (e.g., `foo.bar` → `foo/bar.py` or `foo.bar.py`), which would require path transformation logic elsewhere.

- **[Performance considerations]:** Whether this candidate is used in a hot path and if string concatenation efficiency matters, or if this is incidental to a larger I/O-bound operation.

- **[Python version assumptions]:** Whether this accounts for Python 2 vs. Python 3 module resolution differences, or if it's version-agnostic.
