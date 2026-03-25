---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/blame.ts::BODY_LENGTH
file: src/cli/commands/blame.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.55
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/blame.ts::BODY_LENGTH
  line_range:
    start: 30
    end: 30
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:989d642b17451923b54603aeeca61abbf4cff76ad1feaaa4c8824a337f2af1ec
  structural:
    kind: const
    parent_scope: module
    name: BODY_LENGTH
    index_in_parent: 0
  semantic_fingerprint: >-
    A constant defining a fixed maximum length of 500 characters for blame command output body content, used to
    constrain or truncate response data in the blame command implementation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# BODY_LENGTH

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **55%**

## Purpose

This constant defines a hardcoded length limit of 500 characters, likely used to constrain the size of blame command output or response bodies. In the context of a "blame" command (typically showing which commit/author is responsible for code), this probably truncates detailed commit messages, annotations, or blame information to prevent excessively long output or API responses.

## Inferred Design Rationale

- **Numeric literal as named constant:** The value 500 is extracted into a named constant rather than used inline, suggesting it's a configurable threshold that may be referenced multiple times or likely to change. (Observed)

- **Specific to blame command:** The file location (`blame.ts`) and constant name indicate this limit applies specifically to blame-related output, not a global limit. (Observed)

- **Likely output truncation:** The naming convention `BODY_LENGTH` suggests it limits the "body" or main content portion of blame results, probably separating header/metadata from the truncatable content. (Inferred)

- **Round number selection:** The value 500 appears arbitrary without additional context—it's not a power of 2 or memory-aligned value, suggesting it was chosen based on UX preferences or empirical testing rather than technical constraints. (Inferred)

## What Cannot Be Determined

- **[Usage context]:** Where and how `BODY_LENGTH` is actually applied—whether it truncates commit messages, file diffs, author information, or other blame data.

- **[Unit of measurement]:** Whether 500 represents characters, bytes, lines, or another unit (though `LENGTH` suggests characters).

- **[Business rationale]:** Why 500 specifically—whether this was determined through user feedback, API limitations, terminal width constraints, or arbitrary design.

- **[Historical alternatives]:** Whether other limits were considered or if this value has changed over time.

- **[Error handling]:** How truncation is handled (silent truncation, ellipsis indicators, pagination, etc.).
