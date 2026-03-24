---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/scan.ts::aiScanEnabled
file: src/cli/commands/scan.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:47:59.739Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/scan.ts::aiScanEnabled
  line_range:
    start: 61
    end: 63
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:513ac05adee5f4e0769e6dd564fe996a6840fcd1137f7dc5897c36abf22493df
  structural:
    kind: const
    parent_scope: module
    name: aiScanEnabled
    index_in_parent: 9
  semantic_fingerprint: >-
    Determines whether AI scanning is enabled by checking that static-only mode is off AND either explicit AI flag is
    true OR config specifies manual AI scanning mode.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# aiScanEnabled

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block evaluates a boolean condition to determine if AI-powered scanning should be activated during a CLI scan operation. The variable `aiScanEnabled` is likely used downstream to conditionally execute AI scanning logic. It represents a three-part gate: static-only mode must be disabled, AND at least one of two conditions must enable AI (either an explicit CLI flag or a configuration-based manual trigger).

## Inferred Design Rationale

**Negation of `staticOnly` flag (OBSERVED):** The code requires that static-only mode be OFF before AI scanning can proceed. This likely indicates that static and AI scans are mutually exclusive modes, with static being a lightweight alternative that skips AI processing.

**Dual activation pathways (OBSERVED):** The condition allows AI scanning to be enabled in two independent ways:
- `options.ai === true`: Likely an explicit CLI flag `--ai` passed by the user at runtime
- `config.relationships?.aiScan === 'manual'`: Likely a configuration file setting that permits manual AI scanning

This dual-path design probably accommodates two user workflows: quick CLI overrides vs. persistent configuration preferences.

**Optional chaining on config (OBSERVED):** The `?.aiScan` syntax suggests `config.relationships` may not always exist, indicating defensive coding against missing configuration objects.

## What Cannot Be Determined

**[Business Context]:** Why AI scanning must be mutually exclusive with static-only mode, or what constitutes "manual" vs. other potential modes (automatic, disabled, etc.).

**[Downstream behavior]:** What `aiScanEnabled` actually triggers—whether it gates entire AI features or partial functionality, and what happens when it's false.

**[Config source]:** Where `config` comes from (file, environment, merged defaults) and what other relationship configuration options exist.

**[Default behavior]:** Whether AI scanning is "opt-in" (defaults to false) or "opt-out" (defaults to true) when both conditions are absent.

**[Performance/security implications]:** Why the static-only constraint exists—whether it's performance-based, security-related, or a logical separation of concerns.
