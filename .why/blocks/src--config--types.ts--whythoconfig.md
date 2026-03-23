---
whytho: "1.0"
type: block
symbolic_ref: src/config/types.ts::WhythoConfig
file: src/config/types.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:52.887Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/config/types.ts::WhythoConfig
  line_range:
    start: 4
    end: 71
    commit: 7f4e393ad3ad97418bd42717c027ffe8c7891ace
  content_hash: sha256:b14278447d0689e5d9998ed8a49025cdcd8e1b0914c5dff8bf8c1a6d0e2d812e
  structural:
    kind: interface
    parent_scope: module
    name: WhythoConfig
    index_in_parent: 0
  semantic_fingerprint: >-
    Configuration interface for an AI-powered code annotation system that controls annotation coverage, detail levels,
    file tracking, resolution thresholds, and integration hooks.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 7f4e393ad3ad97418bd42717c027ffe8c7891ace
---

# WhythoConfig

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This TypeScript interface defines the complete configuration schema for "Whytho," an AI-driven code documentation tool that automatically generates annotations for code blocks. The configuration allows users to control which code gets annotated, how detailed those annotations are, which files to process, how to resolve annotation conflicts, and how to integrate with external systems via webhooks. The presence of Anthropic-specific settings suggests this is a primary AI backend, though the generic `aiProvider` field indicates support for alternatives.

## Inferred Design Rationale

**Multi-tier verbosity control:** The nested `verbosity` object with separate `coverage`, `detail`, and token limits (observed) suggests the developers anticipated that annotation scope and richness needed independent control. This likely reflects a real-world trade-off between code comprehensiveness and API costs/speed.

**Token budgeting by scope:** Separate `maxTokens` for `block`, `file`, and `folder` (observed) indicates a hierarchical annotation model where annotations at different levels have different importance or budget constraints. This appears designed to prevent runaway costs on large files.

**Context-aware annotation inclusion:** The `contextChars` fields (observed) suggest downstream prompts use previously-generated annotations as context, so the system limits their size to prevent token bloat—a sophisticated optimization for multi-pass processing.

**Flexible file filtering:** The `tracking` object with both inclusion and exclusion lists (observed) is likely a response to real-world repository complexity, where users need fine-grained control over what gets processed.

**Confidence/supersession thresholds:** (observed) These appear to support deduplication and quality filtering of generated annotations, suggesting the system can produce overlapping or lower-quality annotations that need filtering.

**Commit-time integration:** The `resolution.runOnCommit` and `hookMode` settings (observed) indicate this tool is designed as a pre/post-commit hook, likely to keep annotations synchronized with code changes.

**Optional Anthropic config:** (observed) The `anthropic` block is optional despite `aiProvider` being required, suggesting Anthropic is a default or special case with vendor-specific tuning (model selection, API key environment variable).

## What Cannot Be Determined

**[Business model]:** Whether this is open-source, commercial, or internal-only affects why certain features exist. The token limiting suggests cost concerns, but it's unknown if this reflects actual API pricing pressure or just good practice.

**[Performance requirements]:** What latency/throughput targets drove decisions like context character limits or token budgeting. Real-world execution speeds are unknown.

**[VerbosityCoverage and VerbosityDetail enums]:** What values these accept and their semantic differences. The comments hint at coverage levels ("minimal/standard/full") but the actual enum values are not visible.

**[Historical alternatives]:** Why single `maxTokens` per scope rather than per-model-type, or why `hookMode` is limited to two options rather than supporting custom executables.

**[Default values]:** No defaults are specified in the interface—whether they're applied elsewhere in the codebase is unknown.

**[Webhook payload structure]:** What `webhookUrl` receives when triggered, or what `onRelationshipChanged` parameter format expects.

**[Resolution algorithm]:** What `confidenceThreshold` and `supersededThreshold` actually measure or how they interact with the annotation generation logic.
