---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/scan.ts::registerScan
file: src/cli/commands/scan.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/scan.ts::registerScan
  line_range:
    start: 40
    end: 114
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:9306effad9595c7006e0c675a335e05bf3d26dfba2a9871553f5baa29582039b
  structural:
    kind: function
    parent_scope: module
    name: registerScan
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Registers a CLI command that executes static and/or AI-based relationship scanning across a repository, with
    configurable scope and mode selection, followed by index rebuilding.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# registerScan

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block implements the `scan` subcommand for a CLI tool that analyzes code relationships in a Git repository. It orchestrates two sequential scanning modes (static analysis and AI attribution), respects configuration settings and command-line flags, reports results with token metrics for AI operations, and rebuilds internal indexes upon completion. The command appears designed to help developers understand code dependencies and relationships within their codebase.

## Inferred Design Rationale

- **Dual-mode scanning with override flags**: The code distinguishes between `staticScan` (default-enabled) and `aiScan` (manual/explicit) modes, with `--ai` and `--static-only` flags allowing runtime overrides. This likely reflects a design pattern where static scanning is the standard, fast path, while AI scanning is resource-intensive and opt-in.

- **Initialization guard**: The check for `.why/` directory initialization before proceeding suggests this tool maintains persistent state. This guard prevents operations on uninitialized repositories, enforcing a setup prerequisite.

- **File-level scope limitation for static, global for AI**: The `--file` option constrains static scanning but not AI scanning. This appears intentional—likely because static analysis can efficiently target single files while AI attribution requires holistic context across all files to make accurate relationship inferences.

- **Token counting wrapper for AI**: The `withTokenCounting()` wrapper around the AI provider suggests cost/usage tracking is important, probably because AI operations incur external API charges. Token metrics are logged only when non-zero, minimizing noise in output.

- **Index rebuilding at end**: Both `buildIndex()` and `rebuildArchiveIndex()` execute in parallel after scanning. This design suggests indexes are derived/cached artifacts that must be kept in sync with scanner results.

- **Graceful degradation with validation**: The check for "nothing to do" (when both scan modes are disabled) exits cleanly with a message rather than failing, indicating the tool expects this as a valid (if pointless) configuration state.

## What Cannot Be Determined

- **[Business context]:** Why this tool is named "why" or what problem domain it addresses (code archaeology? compliance? dependency analysis?). The relationship/attribution terminology is generic.

- **[Performance requirements]:** Whether the `allFiles` collection and parallel operations are performance-critical, or what repository sizes this is designed to handle.

- **[AI provider details]:** What `getScanProvider(config)` returns, what the actual AI scanning logic does, or how it differs from static scanning beyond scope.

- **[Index semantics]:** What "archive index" represents or how it differs from the primary index; when/why these need rebuilding.

- **[Configuration defaults]:** What the implicit defaults are for `relationships.staticScan` and `relationships.aiScan` when those config keys are absent.

- **[Error recovery strategy]:** Whether partial failures (e.g., AI scan fails but static succeeds) should be reported differently, or if the current all-or-nothing error handling is intentional.

- **[Historical context]:** Why `--file` was explicitly excluded from AI scanning—whether this was a hard requirement or a pragmatic limitation that may evolve.
