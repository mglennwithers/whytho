---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-helpers.test.ts::applyIncludeFilter
file: tests/unit/mcp-helpers.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.215Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/mcp-helpers.test.ts::applyIncludeFilter
  line_range:
    start: 18
    end: 37
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:6cfdf1ca4c1d991ec3205a7b5a898edaa12c24a8e160415710852932a4007fcd
  structural:
    kind: function
    parent_scope: module
    name: applyIncludeFilter
    parameters: (2 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Selectively reconstructs a document by filtering and reassembling specified sections (frontmatter, body, or named
    sections) from raw markdown content, joining them with double newlines.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# applyIncludeFilter

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function filters and reconstructs markdown/document content based on an inclusion list. Given raw document text and an optional array of section identifiers, it extracts only the requested sections and recombines them. The function appears designed to support selective content extraction—useful for cases where consumers need only specific parts of a larger document (e.g., rendering a document preview without certain sections, or API responses that should expose limited content).

## Inferred Design Rationale

- **Early return on empty/missing filter:** The guard clause `if (!include || include.length === 0) return raw` suggests the function defaults to pass-through behavior when no filtering is requested. *Observed.*

- **Frontmatter extraction via regex:** Frontmatter is handled separately using a regex pattern (`/^---\n([\s\S]*?)\n---/`) rather than delegating to `extractSection()`. This likely reflects that frontmatter has a standardized, fixed format (YAML between triple dashes), making regex appropriate. *Inferred.*

- **Delegation to helper functions:** The code delegates body stripping (`stripFrontmatter()`) and named section extraction (`extractSection()`) to separate functions, suggesting modularity and reusability. *Observed.*

- **Join delimiter choice:** Sections are joined with `\n\n` (double newline), which likely preserves markdown readability and visual separation between sections. *Inferred.*

- **Parts accumulation in order:** The loop preserves the order of requested sections by appending to `parts` in iteration order, suggesting order matters to the caller. *Observed.*

## What Cannot Be Determined

- **[Section naming convention]:** What format named sections use (e.g., heading markers like `## sectionname`, HTML comments, custom delimiters) is unknown; it depends entirely on `extractSection()` implementation.

- **[Expected document format]:** Whether this is strictly markdown, YAML-frontmatter documents, or another format is inferred from code patterns but not explicitly enforced.

- **[Whitespace/edge case handling]:** Whether documents with malformed frontmatter, missing sections, or trailing whitespace are handled gracefully is unknown; `extractSection()` behavior on failure is not visible.

- **[Performance requirements]:** No indication of whether this scales to large documents or frequent calls; regex performance is not a visible concern.

- **[Use case specificity]:** Whether this is for file rendering, API responses, build pipelines, or documentation generation is unknown.

- **[Caller contract]:** Whether `include` order is significant to callers or if duplicate section names are possible is not evident from signature or behavior alone.
