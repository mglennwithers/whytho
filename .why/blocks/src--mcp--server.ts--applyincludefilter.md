---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::applyIncludeFilter
file: src/mcp/server.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-27T22:45:44.543Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::applyIncludeFilter
  line_range:
    start: 341
    end: 360
    commit: a2d9d3f36ccf3c4e492aade0c19aa469967db649
  content_hash: sha256:6cfdf1ca4c1d991ec3205a7b5a898edaa12c24a8e160415710852932a4007fcd
  structural:
    kind: function
    parent_scope: module
    name: applyIncludeFilter
    parameters: (2 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Selectively reconstructs a document by filtering its components (frontmatter, body, named sections) based on an
    inclusion list, reassembling them with paragraph separation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: a2d9d3f36ccf3c4e492aade0c19aa469967db649
---

# applyIncludeFilter

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function enables selective extraction and reassembly of document content based on user-specified include filters. It takes raw document text and an optional list of sections to include, then returns only those specified sections joined together. This likely supports use cases where clients need only certain parts of a larger document (e.g., metadata-only, body-only, or specific named sections), which is common in documentation systems or content management contexts.

## Inferred Design Rationale

**Conditional filtering logic:** The function returns the entire raw document unmodified if no filter is provided (`!include || include.length === 0`). This is a sensible default behavior—filtering is optional and doesn't impose overhead when unused. *(Observed)*

**Three-tier section handling:** The code recognizes three distinct section types with different extraction strategies: frontmatter (regex-based), body (pre-extracted via helper), and named sections (delegated to `extractSection`). This suggests the document model assumes YAML-style frontmatter plus a body that may contain labeled subsections. *(Inferred)*

**Frontmatter regex on raw input:** The frontmatter extraction uses `raw.match()` rather than leveraging an already-parsed structure, suggesting the function receives unparsed text and performs parsing on-demand. *(Observed)*

**Join with double newline:** Reassembled parts are joined with `\n\n` (paragraph breaks), implying a design assumption that sections are meant to be visually separated in output. *(Inferred)*

**Order preservation:** The function iterates through `include` in order and appends results, suggesting section order in the output matches filter specification order. *(Observed)*

## What Cannot Be Determined

**[Helper function behavior]:** The exact behavior and edge cases of `stripFrontmatter()` and `extractSection()` are unknown. Cannot determine if `extractSection()` returns null vs. empty string on missing sections, or how it handles overlapping/nested sections.

**[Business context]:** Why clients would request specific sections, what document types are targeted, or whether this is for internal processing or external API exposure.

**[Performance expectations]:** Whether regex parsing on each call is acceptable or if documents are typically cached/memoized upstream.

**[Frontmatter format strictness]:** Whether the YAML frontmatter regex (`/^---\n([\s\S]*?)\n---/`) is sufficient for all cases or if edge cases like TOML or missing closing delimiter are handled elsewhere.

**[Duplicate handling]:** What happens if `include` contains duplicate section names—does it output the section twice, or is deduplication expected at the call site?

**[Empty section behavior]:** Whether an empty `parts` array (no matching sections found) returning an empty string is intentional or a potential bug.
