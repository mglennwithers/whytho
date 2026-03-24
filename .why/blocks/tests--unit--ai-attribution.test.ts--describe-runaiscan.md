---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/ai-attribution.test.ts::describe(runAIScan)
file: tests/unit/ai-attribution.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/ai-attribution.test.ts::describe(runAIScan)
  line_range:
    start: 67
    end: 183
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:59df9819ddbdecbee42696af8bf191efe5c0b061fd8135d5f0281566f3869bda
  structural:
    kind: describe
    parent_scope: module
    name: describe(runAIScan)
    index_in_parent: 0
  semantic_fingerprint: >-
    Test suite validating an AI-powered code scanning system that attributes dependencies to code blocks while filtering
    hallucinations against a static set of known targets, with safeguards for missing annotations and malformed AI
    responses.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# describe(runAIScan)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This test block validates the `runAIScan` function, which integrates an AI provider to discover and document code dependencies at the block level. The tests verify that: (1) valid AI-detected dependencies are correctly written to block annotations, (2) hallucinated targets outside the static dependency set are rejected, (3) malformed/empty AI responses don't crash the system, and (4) missing block annotations prevent writes. The function appears designed to augment static code analysis with AI-inferred relationships while maintaining safety guardrails.

## Inferred Design Rationale

- **Hallucination guard via static set enforcement** (Test 2): The system validates AI-detected targets against file-level static edges. This likely addresses a known problem where LLMs generate plausible but incorrect dependency claims. Observing this constraint across tests suggests it's a core safety mechanism.

- **Source attribution ("ai" source field)** (Test 1): Relationships are marked with `source: 'ai'` rather than static analysis. This likely enables downstream tooling to distinguish high-confidence static edges from AI-inferred ones and handle them differently (e.g., for review workflows).

- **Block-level annotation targeting** (Test 1, 4): Dependencies are written to block annotations, not file annotations. This design appears to enable fine-grained dependency tracking beyond file-to-file relationships, supporting more precise impact analysis.

- **Graceful degradation on provider failures** (Test 3): Null/malformed AI responses are silently handled without crashing. This likely reflects a decision to treat AI provider unreliability as a non-fatal operational concern rather than a hard error.

- **Annotation prerequisite validation** (Test 4): Triples are skipped if the target block annotation doesn't exist. This suggests the system requires pre-existing structural metadata and doesn't auto-create annotations, probably to avoid generating incomplete or unreviewed records.

- **Result metrics granularity** (`filesProcessed`, `relationshipsFound`, `relationshipsWritten`, `relationshipsSkipped`): Distinction between found/written/skipped suggests the system is designed for observability and batch reporting, likely for auditing AI contributions.

## What Cannot Be Determined

- **[AI Provider Integration]:** Whether the provider is a local LLM, remote API (e.g., OpenAI, Anthropic), or mock—only that it's pluggable via dependency injection.

- **[Annotation File Format Details]:** The exact YAML/TOML structure of frontmatter beyond the observed `relationships` array; unclear whether other metadata fields exist or how they interact with AI edges.

- **[Conflict Resolution]:** How the system handles if a static edge and AI edge both exist for the same target-block pair; whether duplicates are merged, ignored, or error.

- **[Why File-Level Static Edges Exist]:** The origin or purpose of the static edges (e.g., manually maintained, derived from imports, other analysis tools) is not evident.

- **[Performance/Scale Expectations]:** Whether this is designed for single-file scans or large codebases; no timeout, batching, or concurrency logic is visible in the test.

- **[Block Annotation Semantics]:** What "body" means in the block annotation (Test 1) and whether other location types are expected.

- **[Relationship Type Semantics]:** Only `depends_on` is tested; unclear if other relationship types exist or have different handling rules.
