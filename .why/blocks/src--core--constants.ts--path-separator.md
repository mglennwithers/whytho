---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::PATH_SEPARATOR
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:23.971Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.65
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::PATH_SEPARATOR
  line_range:
    start: 14
    end: 14
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:7c5ea1f3027c70446201341b8f1d5eac0512f82f63037172663c70a9a292ec2c
  structural:
    kind: const
    parent_scope: module
    name: PATH_SEPARATOR
    index_in_parent: 11
  semantic_fingerprint: >-
    Defines a constant string delimiter (`--`) used for separating path components or hierarchical identifiers
    throughout the codebase. This appears to be a custom path notation system distinct from filesystem paths.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# PATH_SEPARATOR

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **65%**

## Purpose

This constant exports a string literal `'--'` that likely serves as a delimiter for constructing or parsing hierarchical paths, identifiers, or nested structures within the application. By centralizing this separator as a named constant, the codebase maintains consistency across all locations where path-like strings are built or decomposed, reducing the risk of delimiter mismatches and improving maintainability.

## Inferred Design Rationale

- **Custom delimiter choice:** The use of `'--'` (double-dash) rather than standard filesystem separators (`/`, `\`) or dots (`.`) suggests this is a domain-specific path notation [*inferred*]. This likely indicates paths are semantic/logical rather than filesystem-based.

- **Export as constant:** Exporting from a constants file rather than hardcoding values throughout the codebase follows the DRY principle and enables single-point updates [*observing*]. This is standard practice for magic strings.

- **Naming convention:** The all-caps `PATH_SEPARATOR` naming follows TypeScript/JavaScript conventions for module-level constants [*observing*], making it clearly identifiable as a compile-time invariant.

## What Cannot Be Determined

- **Actual use cases:** Where and how this separator is used (route hierarchies, permission paths, data structures, CLI arguments, etc.) is not evident from the constant alone.

- **Alternative delimiters considered:** Whether `--`, `/`, `.`, `|`, or other candidates were evaluated and why this specific choice prevailed.

- **Business context:** What domain problem this path system solves or what subsystem depends on it.

- **Performance implications:** Whether the choice of `--` has any performance characteristics (e.g., regex escaping, parsing efficiency) relevant to the application.

- **Backward compatibility constraints:** Whether this delimiter was locked in by existing APIs, data formats, or external integrations that prevent change.
