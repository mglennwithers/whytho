---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/go.ts::receiver
file: src/core/parser/plugins/go.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/go.ts::receiver
  line_range:
    start: 80
    end: 80
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:25f6bfc615f8ce658530bd550b17c0772a507896187023eeab5b04dfafd70044
  structural:
    kind: const
    parent_scope: module
    name: receiver
    index_in_parent: 11
  semantic_fingerprint: >-
    Conditionally extracts a receiver group from a regex match object, defaulting to undefined if the pattern doesn't
    define a receiver group. This appears to be parsing Go method receiver syntax from source code.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# receiver

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This block extracts the receiver component from a regex match, likely as part of parsing Go language method declarations. In Go, methods are defined with a receiver (e.g., `func (r *MyType) Method()`), and this code appears to isolate that receiver portion from a larger regex match. The conditional structure suggests that not all patterns being matched contain a receiver group, so the code safely defaults to `undefined` when absent.

## Inferred Design Rationale

- **Conditional extraction pattern:** The ternary operator (`pat.receiverGroup ? ... : undefined`) suggests that `pat` is a configuration object where `receiverGroup` is an optional property indicating which capture group in the regex contains the receiver. This is likely a **defensive design** to handle multiple pattern configurations. (Observing)

- **Regex group indexing:** The code assumes `match` is an array-like object (typical of JavaScript regex `.exec()` or `.match()` results) where numeric indices correspond to capture groups. This is a **standard regex handling pattern**. (Observing)

- **Optional receiver support:** The design probably reflects that some syntax contexts in Go (or the parser's scope) may not have receivers, making this field nullable. (Likely)

## What Cannot Be Determined

- **`pat` object structure:** Beyond `receiverGroup` being a property, the full schema and how it's validated or constructed is unknown.

- **`match` origin:** Whether `match` comes from a single regex or multiple patterns, and whether it could be null/undefined before this line.

- **Downstream usage:** How `receiver` is used after assignment—whether it's validated, transformed, or if `undefined` has special handling.

- **Go syntax scope:** What specific Go declaration patterns this parser targets (all declarations, methods only, etc.) and whether receiver extraction is always needed or sometimes skipped by design.

- **Performance context:** Whether this extraction is performance-critical or if caching/memoization of the pattern property would be beneficial.
