---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-tools.test.ts::describe(get_file_context)
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
  symbolic: tests/unit/mcp-tools.test.ts::describe(get_file_context)
  line_range:
    start: 228
    end: 263
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8dca589bf5e61803a0b81df5bebc4283657e8fccc3bc51b8b0cbf556c297c3e6
  structural:
    kind: describe
    parent_scope: module
    name: describe(get_file_context)
    index_in_parent: 5
  semantic_fingerprint: >-
    Test suite validating a `get_file_context` tool that retrieves documentation annotations from files and code blocks,
    with support for filtering by section type and limiting block results.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(get_file_context)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This test block validates the behavior of a `get_file_context` MCP tool that retrieves contextual documentation for source files. The tool supports three core features: (1) aggregating file-level and inline block-level annotations, (2) filtering results to only the "Purpose" section via a `purpose_only` flag, and (3) limiting the number of included code blocks via a `max_blocks` parameter. The tests verify that the tool correctly includes/excludes content based on these parameters.

## Inferred Design Rationale

**Markdown section parsing:** The code writes annotations using markdown heading syntax (`## Purpose`, `## Tradeoffs`), suggesting the tool parses markdown-formatted documentation. This is likely chosen for human readability and standard adoption. *(Observed)*

**Dual-level annotation model:** The tool distinguishes between file-level annotations (`src/foo.ts`) and block-level annotations (`src/foo.ts::myFn`), indicating a design to support both module-level and function/class-level documentation. *(Observed)*

**Purpose-only filtering:** The `purpose_only` parameter suggests a common use case where only the intent/rationale is needed, not implementation details like tradeoffs. This is likely a UX optimization for AI assistants that need concise context. *(Inferred)*

**Block limiting:** The `max_blocks` parameter allows callers to control token budget or context window size. Setting it to 0 explicitly excludes all block annotations, suggesting this is a cost/performance optimization for large files. *(Inferred)*

**Test cleanup pattern:** All tests use try-finally with `cleanup()`, indicating the tool creates persistent state (likely files in a `.why/` directory) that must be managed. *(Observed)*

## What Cannot Be Determined

**[Storage mechanism]:** Whether annotations are stored in separate metadata files, a database, or embedded in source code comments is not visible from these tests alone.

**[Block discovery method]:** How the tool identifies and locates inline blocks (the `::myFn` syntax) within files—whether via AST parsing, regex, or convention—cannot be determined.

**[Return format details]:** The exact structure of the `result` object and what `resultText()` extracts is abstracted away; whether it's plain text, JSON, or structured markup is unknown.

**[Purpose of `whyRoot` vs `repoRoot`]:** The semantic distinction and relationship between these two directory paths is not explained in the code.

**[Ordering of blocks]:** Whether blocks are returned in source order, by relevance, or alphabetically cannot be determined from these tests.

**[Original motivation]:** Why this tool was built or what problem it solves in the broader MCP system is not evident.
