---
whytho: "1.0"
type: block
symbolic_ref: src/config/types.ts::WhythoConfigSchema
file: src/config/types.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/config/types.ts::WhythoConfigSchema
  line_range:
    start: 6
    end: 80
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4ec02f7d735877552c262ef072d959c64fa6a5aa69212f039f5cf14db3c0a805
  structural:
    kind: const
    parent_scope: module
    name: WhythoConfigSchema
    index_in_parent: 0
  semantic_fingerprint: >-
    A Zod schema defining configuration validation for a multi-provider AI code analysis tool (Whytho) with settings for
    AI providers, verbosity, tracking, resolution strategies, and relationship scanning.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# WhythoConfigSchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This block defines a Zod validation schema for the Whytho configuration system. It establishes the structure and validation rules for configuration files that control how the tool operates across multiple dimensions: which AI provider to use (Anthropic, OpenAI, or Gemini), how verbose its output should be, which files/folders to track, how to resolve conflicts, and whether/how to scan code relationships. The schema ensures that any configuration loaded at runtime matches expected types and constraints before being used by the application.

## Inferred Design Rationale

- **Multi-provider support with parallel structures** (Observed): The identical nesting of `annotationModel`, `inferModel`, `scanModel`, `apiKeyEnv` across Anthropic, OpenAI, and Gemini suggests the tool abstracts over multiple AI backends with pluggable providers. This likely enables vendor flexibility and prevents vendor lock-in.

- **Model differentiation by task** (Observed): Separate model selections for annotation, inference, and scanning suggests different AI models are optimized for different analysis tasks, allowing cost/quality trade-offs per operation type.

- **Batch inference configuration** (Observed): The `batchInfer` settings with `mode`, `threshold`, and concurrency imply the tool can batch process requests for efficiency, with mode controlling when batching occurs and threshold controlling batch size triggers.

- **Optional/gradual adoption pattern** (Observed): Nearly every field is `.optional()`, suggesting configurations can be minimal and adopt sensible defaults, reducing barrier to entry and supporting incremental feature adoption.

- **Verbosity as multi-dimensional tuning** (Observed): Coverage, detail, maxTokens, and contextChars are separated, likely allowing independent control over breadth vs. depth vs. resource consumption, addressing different user needs (quick scans vs. detailed analysis).

- **Tracking as inclusion/exclusion lists** (Observed): Both `includeFolders` and `excludeFolders` exist, suggesting a whitelist + blacklist model for flexible scope definition across projects of varying structure.

- **Resolution confidence thresholds** (Observed): The 0-1 bounded thresholds for `confidenceThreshold` and `supersededThreshold` indicate probabilistic conflict resolution, likely filtering low-confidence AI outputs.

- **Hook/webhook extensibility** (Observed): The `hooks.onRelationshipChanged` and `webhookUrl` fields suggest the system can trigger external integrations when relationship state changes, enabling CI/CD pipeline integration.

- **Positional constraints on numeric fields** (Observed): Use of `.positive()`, `.nonnegative()`, and `.min(0).max(1)` shows thoughtful validation preventing nonsensical configurations (negative token counts, out-of-range probabilities).

## What Cannot Be Determined

- **[Business context]:** What "Whytho" stands for, what problem domain it addresses, or what "relationships" mean in the context of code analysis—likely architectural dependencies, but unconfirmed.

- **[Default values]:** No default values are visible in the schema itself; what sensible defaults are applied when optional fields are omitted is handled elsewhere in the codebase.

- **[Version strategy]:** Why `specVersion` is hardcoded to '1.0' and whether/how schema migration is handled for future versions.

- **[Provider selection logic]:** How the system chooses among multiple configured providers when `aiProvider` is set; whether it's priority-based, fallback-based, or something else.

- **[OpenAI/Gemini concurrency difference]:** Why OpenAI and Gemini have `concurrency` in their `batchInfer` config but Anthropic doesn't—whether this is intentional API capability variance or incomplete refactoring.

- **[Hook execution semantics]:** Whether `onRelationshipChanged` is a script path, function name, or webhook trigger, and how errors are handled.

- **[Relationship scanning modes]:** What behavioral difference exists between `staticScan` (boolean) and `aiScan` (enum with 'off'/'manual'/'on_commit'), and whether they can run in parallel.

- **[Performance/compliance implications]:** Why certain token/context limits exist or what thresholds are typical in production; whether privacy settings have security implications beyond the visible `omitUser` flag.
