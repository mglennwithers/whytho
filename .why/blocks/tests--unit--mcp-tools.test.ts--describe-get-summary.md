---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-tools.test.ts::describe(get_summary)
file: tests/unit/mcp-tools.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/mcp-tools.test.ts::describe(get_summary)
  line_range:
    start: 369
    end: 378
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:ae614a493e744056221fb61b93c341d3e0364e51e04990657690d4df80800d3f
  structural:
    kind: describe
    parent_scope: module
    name: describe(get_summary)
    index_in_parent: 9
  semantic_fingerprint: >-
    Tests that the `get_summary` tool correctly reports an error state when the `.why` index has not been initialized,
    verifying graceful failure handling for missing prerequisite data.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(get_summary)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This test verifies that the `get_summary` tool gracefully handles the scenario where the `.why` system has not been properly initialized (specifically, when `index.json` is missing). It ensures that instead of crashing or returning invalid data, the tool returns a user-friendly message indicating the problem. This is a defensive test for a common failure mode in the system.

## Inferred Design Rationale

- **Temporary repo creation with cleanup pattern** (observed): The test uses `makeTempRepo()` and a try/finally block with `cleanup()`. This indicates the codebase requires isolated test environments and follows good test hygiene practices to avoid test pollution.

- **Direct tool dispatch mechanism** (observed): The `dispatchTool()` function is called with specific parameters (whyRoot, repoRoot, tool name, empty object). This suggests the system has a generic tool-dispatch abstraction layer, allowing tools to be invoked uniformly.

- **Flexible output assertion using regex** (inferred): The test uses a loose regex match `/No index|Summary|Coverage/i` rather than asserting an exact message. This likely accommodates multiple acceptable message formats and suggests either: (a) the exact wording is not critical to the contract, or (b) the output format was still in flux when this test was written.

- **Empty parameter object** (inferred): Calling `get_summary` with `{}` suggests the tool either accepts no required parameters or has sensible defaults, making it safe to invoke on an uninitialized system.

## What Cannot Be Determined

- **[Initialization requirements]:** What constitutes "proper initialization" of `.why` beyond having `index.json`. Whether other files or data structures are also required is unclear.

- **[Expected message specifics]:** Why those three keywords (No index, Summary, Coverage) are acceptable responses, or whether they represent different failure modes or just flexible wording.

- **[Tool dispatch semantics]:** Whether `dispatchTool` makes actual tool calls, mocks them, or loads them from disk. The integration level is not determinable.

- **[Business context]:** What `.why` system is, what the index represents, or why this check is important to users.

- **[Error handling coverage]:** Whether other initialization failures (corrupt index, permission errors, etc.) are tested elsewhere, or if this is the only error path being validated.
