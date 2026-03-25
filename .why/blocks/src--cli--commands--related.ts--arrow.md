---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/related.ts::arrow
file: src/cli/commands/related.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:30.106Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/related.ts::arrow
  line_range:
    start: 42
    end: 42
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:d10ae3c65c42e50473df5fbd43f0c4c56021343cb8fafc2753aed2a4a9ed955e
  structural:
    kind: const
    parent_scope: module
    name: arrow
    index_in_parent: 5
  semantic_fingerprint: >-
    Selects a directional arrow character (→ or ←) based on whether the direction is 'out' or not, for use in displaying
    relationship flow in CLI output.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# arrow

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block assigns a Unicode arrow character to the `arrow` variable, selecting the right-pointing arrow (→) when `direction` is 'out' and the left-pointing arrow (←) otherwise. The variable likely serves to visually represent the direction of relationships in command output, making it easier for users to understand the flow or direction of connections being displayed in a terminal interface.

## Inferred Design Rationale

**Ternary operator for brevity:** The developer chose a ternary conditional rather than an if/else statement, suggesting this is a simple, straightforward mapping with no additional side effects. (Observed)

**Unicode arrow characters:** The use of directional arrow symbols (→ and ←) rather than ASCII alternatives (e.g., `->`), indicates the output is targeting modern terminals that support Unicode, likely prioritizing visual clarity and UX polish. (Inferred)

**Binary direction check:** The logic treats 'out' as one case and everything else as its opposite, suggesting a bidirectional relationship model where 'out' and 'in' are the only meaningful states. (Inferred)

## What Cannot Be Determined

**[Business context]:** What "related" entities or relationships this command displays, or why directional flow matters to users in this domain.

**[Complete enum/type definition]:** Whether `direction` is actually limited to 'out'/'in' values, or if other values exist that would be handled by the else clause.

**[Output format]:** How this arrow is used in the larger output string—whether it's part of a graph visualization, list formatting, or other CLI presentation style.

**[Localization/accessibility]:** Whether Unicode arrows are appropriate for all target users, or if ASCII fallbacks were considered for compatibility with legacy terminals.

**[Historical alternatives]:** Whether previous versions used different symbols, or why this particular character pairing was selected.
