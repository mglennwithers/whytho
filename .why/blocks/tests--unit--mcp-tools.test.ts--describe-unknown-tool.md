---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-tools.test.ts::describe(unknown tool)
file: tests/unit/mcp-tools.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/mcp-tools.test.ts::describe(unknown tool)
  line_range:
    start: 380
    end: 388
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:b955d5f154da29dd0e894be07735b9aaa82a6984e3f192555e546b93e3f72502
  structural:
    kind: describe
    parent_scope: module
    name: describe(unknown tool)
    index_in_parent: 10
  semantic_fingerprint: >-
    Tests that the tool dispatcher correctly handles requests for non-existent tools by returning an "Unknown tool"
    error message, ensuring graceful failure for invalid tool names.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(unknown tool)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This test block validates error handling in the MCP (Model Context Protocol) tool dispatcher when a user attempts to invoke a tool that doesn't exist in the system. It verifies that instead of crashing or returning undefined behavior, the system responds with a clear "Unknown tool" message. This is a critical safeguard for API robustness—ensuring that invalid tool invocations fail gracefully rather than silently or catastrophically.

## Inferred Design Rationale

**Resource Setup and Cleanup Pattern** (Observed): The test uses `makeTempRepo()` to create isolated temporary test environments and wraps execution in a try-finally block to guarantee cleanup. This indicates the codebase prioritizes test isolation and resource hygiene, likely to prevent test pollution or disk space leaks.

**Message-Based Error Reporting** (Inferred): The code checks for an "Unknown tool" string in the response rather than checking an error code or exception type. This suggests the tool dispatcher returns errors as structured messages within result objects, probably to maintain consistency with successful responses or to allow the MCP protocol to handle all outcomes uniformly.

**Helper Abstraction** (Observed): The use of `resultText()` suggests result objects have a non-trivial structure; the helper likely extracts human-readable text from a complex response format, reducing test brittleness.

## What Cannot Be Determined

**[Protocol Specification]:** Whether "Unknown tool" is a standardized MCP response or a project-specific convention is unknown.

**[Dispatcher Implementation]:** The actual logic for tool resolution—whether it uses a registry, reflection, or configuration file lookup—cannot be inferred from this test alone.

**[Error Response Format]:** The complete structure of the result object (e.g., whether it includes status codes, stack traces, or localized messages) is hidden by the `resultText()` abstraction.

**[Test Coverage Completeness]:** Whether other invalid tool scenarios (malformed names, null/undefined, permission denied) are tested elsewhere is not visible.

**[Business Context]:** Why this particular error case was prioritized for testing or whether it's part of a compliance requirement (e.g., API contract testing) cannot be determined.
