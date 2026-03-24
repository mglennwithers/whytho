---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/generic.ts::genericPlugin
file: src/core/parser/plugins/generic.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:25.451Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/generic.ts::genericPlugin
  line_range:
    start: 64
    end: 106
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:8771f5dead5e0636489672ffb0087bc6cd1c79ab11a62c6b550e41616db616e2
  structural:
    kind: const
    parent_scope: module
    name: genericPlugin
    index_in_parent: 1
  semantic_fingerprint: >-
    A fallback parser plugin that extracts code block definitions (functions, classes, etc.) from any file type by
    pattern matching lines and estimating block boundaries, maintaining per-kind occurrence counts for indexing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/parser/types.ts::ParserPlugin
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
---

# genericPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block implements a generic/catch-all parser plugin that extracts structured metadata about code blocks (functions, classes, etc.) from source files regardless of file type. It appears to be part of a larger documentation or analysis system that parses multiple file formats and extracts consistent block-level information. The plugin likely serves as a fallback when language-specific parsers aren't available, as indicated by the `extensions: ['*']` wildcard matching all file types.

## Inferred Design Rationale

1. **Pattern-based matching (observed):** The code iterates through `PATTERNS` (defined elsewhere) to identify block definitions via regex matching. This approach allows flexibility to support multiple syntaxes without language-specific parsing logic.

2. **Index-per-kind tracking (observed):** The `kindCounts` map maintains occurrence counts for each block kind, which are stored as `indexInParent`. This likely enables unique identification of blocks and supports ordering/sorting operations downstream.

3. **Block boundary estimation (inferred):** Rather than fully parsing syntax trees, the code calls `findBlockEnd()` to estimate where blocks terminate. This is probably a heuristic (finding next definition or EOF) rather than scope-aware parsing, trading accuracy for simplicity and performance across unknown syntaxes.

4. **Single pattern per line (observed):** The `break` statement ensures only one pattern matches per line, preventing duplicate extraction and simplifying ambiguous cases.

5. **Line-number indexing (observed):** Storage of `startLine` and `endLine` (1-indexed for `startLine`) suggests the output feeds systems requiring source mapping.

6. **Module-level scope assumption (observed):** All blocks are assigned `parentScope: 'module'`, indicating this parser doesn't track nested scopes—likely a limitation accepted for generic parsing.

## What Cannot Be Determined

- **[PATTERNS definition]:** The actual regex patterns, their named groups, and supported block kinds are defined outside this block. Their specificity and coverage directly impact parser quality but cannot be evaluated here.

- **[findBlockEnd() heuristic]:** The block boundary detection strategy (line-search algorithm, scope inference, heuristics for different languages) is opaque. Its accuracy and whether it handles nested structures is unknown.

- **[Performance requirements]:** Whether this linear scan through lines and patterns is acceptable for large files, and whether memoization or incremental parsing was considered.

- **[Error handling strategy]:** The code has no visible error handling. Whether malformed input, encoding issues, or pattern overlaps are handled upstream or cause silent failures.

- **[ParsedBlock usage]:** How downstream consumers use `parentScope: 'module'`, `indexInParent`, and `content` fields—whether flat indexing is sufficient or if nesting information is reconstructed elsewhere.

- **[Business/domain context]:** What documentation system, IDE feature, or analysis tool this serves; whether accuracy or coverage is prioritized.

- **[Alternatives considered]:** Why generic regex-based parsing was chosen over AST-based approaches, even for common languages.
