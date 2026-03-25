---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::fullBody
file: src/cli/commands/infer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T02:10:27.238Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::fullBody
  line_range:
    start: 314
    end: 314
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:5365e5529f2e291b4d36aa67b0bc540978b0d976fde4618e37148ae100d011de
  structural:
    kind: const
    parent_scope: module
    name: fullBody
    index_in_parent: 35
  semantic_fingerprint: >-
    Constructs a markdown-formatted documentation string by combining a block name as a heading, a confidence-qualified
    disclaimer, and inferred body content.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# fullBody

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This block assembles a complete documentation body by concatenating three markdown components: a heading derived from `block.name`, a disclaimer message (whose content varies based on a `confidence` parameter), and pre-computed `body` content. The result is likely used to generate or display inferred documentation with appropriate caveats about reliability.

## Inferred Design Rationale

- **Markdown formatting with template literals:** The use of backticks and markdown syntax (`#` for heading, `\n` for line breaks) indicates this is building markdown output, likely for display or export in documentation tooling. This choice appears deliberate to support human-readable formatted output.

- **Confidence-driven disclaimers:** The `inferredDisclaimer(confidence)` call suggests the code implements a transparency pattern—documenting how confident an inference was. This likely reflects a requirement to qualify auto-generated documentation with reliability information.

- **Fixed ordering (heading, disclaimer, body):** The structure places the disclaimer between heading and body, probably to ensure disclaimer visibility without disrupting the logical flow of technical content.

## What Cannot Be Determined

- **[Context of `block` object]:** What properties `block` contains beyond `name`, and what data structure it represents (e.g., code AST node, API schema, inferred documentation unit).

- **[Nature of `body` variable]:** How `body` is computed, whether it's pre-generated markdown or plain text, and what content it typically contains.

- **[Disclaimer content]:** What `inferredDisclaimer()` actually outputs for different confidence levels, or whether disclaimers are user-facing or internal metadata.

- **[Consumer of `fullBody`]:** Where this string is used downstream—written to file, displayed in UI, passed to another function, or formatted differently.

- **[Confidence scale]:** Whether `confidence` is a 0–1 float, percentage, or categorical value, and what thresholds trigger different disclaimers.
