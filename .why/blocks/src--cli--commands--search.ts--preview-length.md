---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::PREVIEW_LENGTH
file: src/cli/commands/search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:30.585Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.75
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/search.ts::PREVIEW_LENGTH
  line_range:
    start: 30
    end: 30
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:e2b0078379795ca93daae92d70b501e71648f38664c0d4547956a3942651d107
  structural:
    kind: const
    parent_scope: module
    name: PREVIEW_LENGTH
    index_in_parent: 0
  semantic_fingerprint: >-
    A numeric constant defining the maximum character length for preview text output in search results, used to truncate
    or limit display content.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# PREVIEW_LENGTH

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **75%**

## Purpose

This constant defines a 200-character limit for preview text in search command output. It likely exists to ensure search results display concisely in CLI output, preventing excessively long text blocks that could overwhelm users or break terminal formatting. The constant is probably used to truncate result descriptions, snippets, or matching content before presentation.

## Inferred Design Rationale

- **Magic number extraction:** The value `200` is extracted into a named constant rather than inlined, suggesting [OBSERVED] it's either used in multiple locations or the developer wanted to make it easily configurable. This enables future adjustments without code hunting.

- **Specific threshold choice:** The 200-character limit [INFERRED] represents a balance between providing useful context to users and maintaining readability in typical terminal widths (80-120 columns). This is a common pattern in CLI tools.

- **Placement in search.ts:** [OBSERVED] The constant resides in a search-specific module, indicating it applies specifically to search result previews rather than being a global default.

## What Cannot Be Determined

- **[Actual usage locations]:** Where and how many times this constant is referenced in the codebase cannot be verified from this block alone.

- **[Business requirements]:** Whether 200 characters was driven by UX research, user feedback, or terminal standards is unknown.

- **[Historical context]:** Whether this value was tuned based on performance testing or changed from a previous threshold cannot be determined.

- **[Related preview lengths]:** Whether other commands use different preview lengths and the reasoning for divergence is not visible here.

- **[Truncation behavior]:** The strategy for handling preview text exceeding this limit (ellipsis, word-break logic, etc.) is not defined in this constant.
