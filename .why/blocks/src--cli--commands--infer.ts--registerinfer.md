---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::registerInfer
file: src/cli/commands/infer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::registerInfer
  line_range:
    start: 64
    end: 350
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:4404418b67fe28ead11964f54c670f4e9f5c518f37390551b7c83b81974dc7b6
  structural:
    kind: function
    parent_scope: module
    name: registerInfer
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    A CLI command that generates AI-inferred documentation annotations for unannotated code blocks, files, and folders
    in a repository, with configurable coverage levels and limits.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# registerInfer

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This function registers a `git why infer` command that automatically generates missing documentation annotations for code elements using an AI provider. It performs a three-pass annotation process (blocks → files → folders), respecting a generation limit and optional dry-run mode. The command is part of a documentation system that tracks "why" explanations for code artifacts across a repository.

## Inferred Design Rationale

**Three-pass hierarchical processing:** The code processes annotations in order of granularity (blocks → files → folders), likely because (1) smaller units provide context for larger ones, and (2) this ordering allows file annotations to reference existing block annotations, and folder annotations to reference file annotations. This is *observed* in the code where Pass 2 reads block annotations for context, and Pass 3 reads file annotations.

**Pre-parsed file caching:** All source files are parsed once upfront and stored in `parsedFileCache` before any passes execute. This likely optimizes performance and ensures consistent block parsing across passes. *Inferred* from the comment "reuse parsed blocks across passes."

**Coverage filtering:** The `minimal` coverage option filters blocks to only `function`, `method`, `class`, `interface` kinds. This *appears* to be a pragmatic choice to reduce token usage and focus on public/significant API elements rather than all code constructs.

**Confidence scoring:** Each inferred annotation includes an `inference_confidence` metric from the AI provider's response. This is *likely* included to indicate annotation reliability to downstream tools/users, allowing filtering or review workflows.

**Dry-run mode:** The `--dry-run` option skips file writes but still counts toward the limit and output. This *appears* designed to let users preview the scope of work before committing changes.

**Limit-based pagination:** The `--limit` option stops generation and suggests re-running. This *likely* exists to avoid overwhelming the AI API with large batches and to allow users to review incremental progress.

**Session tracking:** All generated annotations include `INFERRED_SESSION` (likely a constant like `"auto-infer"`) and timestamp metadata. This *appears* designed to distinguish AI-generated from human-authored annotations and track generation time.

**Verbosity configuration layers:** Verbosity settings cascade from CLI options → config file → defaults, with per-type token budgets and context sizes. This *appears* to give fine-grained control over annotation detail per artifact type while respecting resource constraints.

## What Cannot Be Determined

**[AI Provider Selection]:** The code calls `getInferProvider(config)` but the logic for which provider is selected (OpenAI, Anthropic, etc.) is not visible. The performance characteristics and cost implications of this choice are unknown.

**[Prompt Engineering Details]:** `buildInferredBlockPrompt`, `buildInferredFilePrompt`, and `buildInferredFolderPrompt` are imported functions whose implementation is hidden. The quality of generated annotations depends entirely on these prompts, which cannot be evaluated here.

**[Inference Confidence Calculation]:** How `parseInferredResponse(raw)` extracts and calculates confidence scores from AI responses is opaque. Whether this reflects true semantic confidence or is a heuristic is unknown.

**[Repository Size Limitations]:** There are no visible guards against running this on very large repositories. How the code behaves with 10k+ files or 100k+ blocks is unclear.

**[Annotation Collision Handling]:** The code skips existing annotations (early `continue`), but the behavior if an annotation file exists but is corrupted, or if a symbolic reference changes due to refactoring, is not specified.

**[Language Detection Accuracy]:** `detectLanguage(filePath)` result is stored but never appears to be used in subsequent AI context. Why it's captured is unclear.

**[AI Token Budget Enforcement]:** `maxTokens` is passed to `callViaProvider` but how overages are handled (truncation, error, retry) is not visible.

**[Semantic Fingerprint Generation Strategy]:** For blocks with no existing semantic fingerprint, a fallback string is computed; for files/folders this appears to be omitted entirely. The reasoning behind this inconsistency is unclear.

**[Performance of `getTrackedFiles`]:** The code filters results by git-tracked files, but whether this is a git-ls-files call or reads a cached index is unknown, as is its performance on large repos.
