---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::registerSearch
file: src/cli/commands/search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:30.642Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/search.ts::registerSearch
  line_range:
    start: 89
    end: 182
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4d29a999e7a7ea6be505419fd78aba4282334f78b3270b041cc44b6bd06deae8
  structural:
    kind: function
    parent_scope: module
    name: registerSearch
    parameters: (1 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Registers a CLI command that searches annotations across blocks, files, folders, and sessions using either semantic
    AI-powered matching or substring text search, with optional JSON output and token usage reporting.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# registerSearch

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function registers a `search` subcommand for a CLI program that enables users to query annotations stored in a `.why/` directory. The command supports two search modalities: semantic search (leveraging an AI provider) and basic text search (substring matching). It appears designed to help developers locate relevant annotations across their codebase in a flexible, composable way while maintaining awareness of token usage costs when using AI.

## Inferred Design Rationale

**Two-mode search architecture (semantic vs. text):** The code branches on `options.semantic` to provide fundamentally different search strategies. This design likely exists because semantic search is more powerful but expensive (requires AI API calls and token costs), while text search is fast and free. Users can choose based on their needs. *(Observing)*

**Type filtering system:** The `--type` option allows filtering by annotation category (block, file, folder, session), and the code conditionally reads only necessary data. This likely improves performance by avoiding unnecessary I/O when users know what they're searching. *(Inferring)*

**Token counting wrapper:** The semantic search path wraps the AI provider with `withTokenCounting()` and displays token usage. This suggests either cost-awareness is important to users, or there's a need to track API usage for billing/quota purposes. *(Inferring)*

**Unified hit formatting:** Both search modes return results in a consistent `SearchHit[]` structure, suggesting the output layer is intentionally decoupled from the search implementation to support multiple display formats (human-readable vs. JSON). *(Observing)*

**AI prompt delegation:** Rather than implementing semantic matching directly, the code builds a prompt and delegates to an AI provider. This design choice suggests: (a) semantic matching is complex enough to warrant specialized AI logic, (b) the system is extensible to different LLM backends via the provider abstraction. *(Inferring)*

**Initialization guard:** The code checks `isWhyDirInitialized()` early and exits if unmet, enforcing a precondition rather than handling gracefully. This suggests `.why/` initialization is a prerequisite workflow. *(Observing)*

## What Cannot Be Determined

**[Performance characteristics]:** Whether text search is truly faster than semantic search in practice, or if there are latency/throughput guarantees for either mode. No benchmarking or optimization hints are visible.

**[AI provider selection]:** What `getDefaultProvider(config)` returns, which LLM services are supported, or why a specific provider was chosen. The abstraction hides implementation details.

**[Semantic matching algorithm]:** How `buildSemanticSearchPrompt()` and `parseSemanticSearchResponse()` work. The parsing logic could be fragile, incorrect, or context-dependent in ways not visible here.

**[Data volume handling]:** Whether this scales to large annotation sets. Loading all blocks/files/folders/sessions into memory (`readAll*`) could be problematic for repositories with thousands of annotations. No pagination or streaming is evident.

**[Text search implementation]:** What `textSearch()` does exactly—whether it's case-insensitive, supports regex, or uses a specialized index. The function name suggests substring matching, but edge cases are unknown.

**[Business context]:** Why this CLI tool exists, what problem it solves, or whether semantic search was requested by users or anticipated as a feature.

**[Error recovery]:** Why `process.exit(1)` is used rather than throwing/returning errors. This suggests a CLI-specific constraint, but the reasoning isn't documented.

**[JSON schema]:** The exact structure and completeness of the JSON output format—whether `SearchHit` includes all necessary metadata for programmatic consumption.
