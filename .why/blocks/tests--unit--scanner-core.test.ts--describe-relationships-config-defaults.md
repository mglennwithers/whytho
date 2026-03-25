---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-core.test.ts::describe(relationships config defaults)
file: tests/unit/scanner-core.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.607Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/scanner-core.test.ts::describe(relationships config defaults)
  line_range:
    start: 14
    end: 22
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:02d876abaa52181dba28a54ae7850494e95db563eae6affd35de7ba006b022e4
  structural:
    kind: describe
    parent_scope: module
    name: describe(relationships config defaults)
    index_in_parent: 0
  semantic_fingerprint: >-
    Validates that the DEFAULT_CONFIG object for relationships scanning has staticScan enabled and aiScan disabled by
    default, establishing the baseline configuration behavior.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(relationships config defaults)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This test block verifies the default configuration state for a relationships scanning feature. It ensures that when the scanner is initialized without explicit configuration, static analysis scanning is active while AI-based scanning is disabled. This likely exists to document and protect the intended baseline behavior of the scanner, preventing accidental changes to defaults through regression testing.

## Inferred Design Rationale

- **Two-tier scanning approach:** The code reveals (observing) a system with two independent scanning modes—static and AI-based—suggesting the developers wanted flexibility to enable/disable these independently. This allows users to choose between lightweight static analysis or more sophisticated AI analysis.

- **Static-first strategy:** StaticScan defaults to `true` while aiScan defaults to `'off'` (observing). This likely indicates (inferring) that static analysis is considered the primary, always-available scanning method, while AI scanning is treated as an optional enhancement, possibly due to performance cost, external dependency requirements, or feature maturity considerations.

- **String vs boolean values:** aiScan uses a string value `'off'` rather than a boolean `false` (observing). This suggests (inferring) the enum-like property might support multiple states beyond binary on/off (`'off'`, `'on'`, possibly others like `'limited'`), providing more granular control than simple toggles.

## What Cannot Be Determined

- **[Business Context]:** Why these specific defaults were chosen—whether this reflects user research, performance constraints, licensing/cost considerations, or feature maturity levels.

- **[Scanning Capabilities]:** What "staticScan" and "aiScan" actually do functionally, what they analyze, or how they differ in scope and accuracy.

- **[Configuration Structure]:** Whether `relationships` is optional in DEFAULT_CONFIG, whether other scanning modes exist, or whether these settings cascade to other parts of the system.

- **[Performance Trade-offs]:** Why AI scanning is disabled by default—whether it's for performance reasons, external API dependencies, accuracy concerns, or simply a conservative default pending user opt-in.

- **[Historical Alternatives]:** Whether the developers considered different default strategies (e.g., both enabled, both disabled) or what influenced the current choice.
