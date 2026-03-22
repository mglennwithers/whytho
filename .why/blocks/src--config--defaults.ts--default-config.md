---
whytho: "1.0"
type: block
symbolic_ref: src/config/defaults.ts::DEFAULT_CONFIG
file: src/config/defaults.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-22T02:19:55.527Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/config/defaults.ts::DEFAULT_CONFIG
  line_range:
    start: 10
    end: 47
    commit: 68f587a2bb9ea894825135fb2fe3a1217044d15f
  content_hash: sha256:02ccf1bf99c7b925f0fe1da77ae7f738deae1432a745c1807eecd6ff331d7088
  structural:
    kind: const
    parent_scope: module
    name: DEFAULT_CONFIG
    index_in_parent: 0
  semantic_fingerprint: >-
    Exports a comprehensive default configuration object for Whytho, a code documentation/annotation system,
    establishing baseline settings across AI providers, verbosity levels, file tracking, resolution thresholds, and
    privacy controls.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68f587a2bb9ea894825135fb2fe3a1217044d15f
---

# DEFAULT_CONFIG

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines the DEFAULT_CONFIG constant, which appears to be the fallback configuration for a system called "Whytho" that automates code annotation and documentation. The configuration establishes sensible defaults across multiple dimensions: AI model selection, output verbosity, file inclusion/exclusion patterns, confidence thresholds for documentation resolution, and privacy preferences. This likely exists to allow the system to function immediately upon installation with reasonable behavior, while remaining fully customizable.

## Inferred Design Rationale

**Hierarchical Configuration Structure:** The config is organized into functional domains (aiProvider, anthropic, verbosity, tracking, resolution, parser, hooks, privacy) rather than a flat structure. This likely reflects a design prioritizing discoverability and maintainability as the system grows.

**Token Budget Constraints:** The `maxTokens` object with tiered limits (block: 4096, file: 8192, folder: 16384) appears to acknowledge cost/performance tradeoffs in LLM interactions. The hierarchy suggests annotations scale their detail based on scope.

**Context Window Management:** The `contextChars` field (blockInFile: 800, fileInFolder: 800) likely represents the maximum surrounding context provided to the AI model, suggesting the system generates localized, rather than global, documentation.

**Threshold-Based Resolution:** The presence of `confidenceThreshold` and `supersededThreshold` suggests the system evaluates whether generated documentation should be committed, requiring explicit confidence gates.

**Git Integration:** The `resolution.runOnCommit` and `hookMode: 'post-commit'` strongly indicate this integrates with version control workflows, automatically triggering on commits.

**Extensibility Points:** Fields like `additionalPlugins` and empty `hooks` object suggest the design anticipated plugin/extension needs from inception.

## What Cannot Be Determined

**[Business Context]:** Why this system was built, what problem it solves for users, or what Whytho stands for.

**[AI Model Selection Rationale]:** Why Anthropic was chosen as the default provider and whether other providers are supported but not shown here.

**[Threshold Values]:** The reasoning behind specific confidence threshold values (referenced via DEFAULT_CONFIDENCE_THRESHOLD constant, not inlined), or how "standard" verbosity was calibrated.

**[Default Behavior Trade-offs]:** Whether defaults favor speed, accuracy, cost reduction, or privacy, or how these were weighted.

**[Hook Implementation]:** What hooks are actually available or how the empty `hooks: {}` object is populated at runtime.

**[Feature Completeness]:** Whether all configuration options are actually implemented in the codebase or if some are aspirational/future work.

**[Performance/Scale Requirements]:** Whether token limits were derived from cost constraints, API rate limits, or latency requirements.
