---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-tools.test.ts::describe(get_folder)
file: tests/unit/mcp-tools.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/mcp-tools.test.ts::describe(get_folder)
  line_range:
    start: 146
    end: 155
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:560c8c7e5c487018c21c02c702a477095c184526a98e46b0bb2cf8e7a689bcfb
  structural:
    kind: describe
    parent_scope: module
    name: describe(get_folder)
    index_in_parent: 2
  semantic_fingerprint: >-
    Tests that the `get_folder` tool correctly retrieves and returns the annotation content (markdown description)
    associated with a folder path.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(get_folder)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This test block verifies that a tool named `get_folder` functions correctly by:
1. Creating a temporary repository structure
2. Writing folder annotation content (markdown) to a `src/` directory
3. Dispatching the `get_folder` tool with that path
4. Asserting that the returned result contains the expected annotation text

The test likely exists to ensure the tool's core contract—retrieving stored folder metadata/documentation—works as intended.

## Inferred Design Rationale

- **Temporary repo creation and cleanup**: The test uses `makeTempRepo()` and a try/finally block with `cleanup()` to ensure test isolation and prevent side effects. This is standard practice for filesystem-based tests.

- **Annotation storage via `writeFolder`**: The code appears to write markdown annotations to folders using a `writeFolder` helper. This suggests folders can carry metadata/documentation separate from their file contents (observing the `## Purpose\n\nAll source code.` pattern).

- **Tool dispatch abstraction**: Rather than directly calling `get_folder`, the code uses `dispatchTool()`, which likely abstracts away transport/protocol details (possibly MCP—Model Context Protocol, given the filename). This suggests the tool is designed to work across different invocation contexts.

- **Result extraction with `resultText()`**: The helper `resultText()` is applied to the result before assertion, indicating the raw result object likely wraps text content in a structured format.

## What Cannot Be Determined

- **[Tool transport mechanism]:** What protocol or framework `dispatchTool` uses internally (though "MCP" in the filename suggests Model Context Protocol).

- **[Annotation storage format]:** How `writeFolder` actually persists the annotation (filesystem metadata, separate `.why` files, database entries, etc.).

- **[Tool behavior on missing folders]:** What happens when `get_folder` is called on a non-existent path or one without annotations.

- **[Result structure]:** The shape of the object returned by `dispatchTool` before `resultText()` processing.

- **[Performance/scale requirements]:** Whether this tool needs to handle large folders, deeply nested paths, or high concurrency.

- **[Why annotations use markdown]:** Whether markdown is required by design or just incidental to the test case.
