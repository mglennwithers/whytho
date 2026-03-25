---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/types.ts::ParsedBlock
file: src/core/parser/types.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:34.311Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/types.ts::ParsedBlock
  line_range:
    start: 3
    end: 12
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:5342447628442bf790df1e527a6ff2824a035880358f9a0426fb6936e2642fda
  structural:
    kind: interface
    parent_scope: module
    name: ParsedBlock
    index_in_parent: 0
  semantic_fingerprint: >-
    An interface representing a parsed code block with metadata about its structure, location, and hierarchy within a
    source file, enabling tracking of block positions and relationships.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/types.ts::BlockKind
    source: ai
---

# ParsedBlock

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the shape of a parsed block—a discrete unit of code that has been analyzed and decomposed by a parser. It appears to serve as the primary data structure for communicating parsing results, containing both structural metadata (kind, name, hierarchy) and positional information (line numbers, content). This likely exists to support downstream analysis, transformation, or visualization of code structure.

## Inferred Design Rationale

- **`kind: BlockKind`** — A discriminated field (likely an enum) that categorizes what type of block this is. This suggests the parser handles multiple syntactic constructs (functions, classes, statements, etc.) and needs to preserve their type information for consumers.

- **`name: string`** — Blocks are expected to have identifiable names, suggesting the parser targets named constructs. This is essential for navigation, cross-referencing, and user-facing output.

- **`parentScope: string`** — Explicitly tracks the parent's identifier rather than a reference object. This design likely keeps the interface serializable and avoids circular references, suggesting blocks may be stored, transmitted, or traversed in tree structures.

- **`parameters?: string`** — Optional field storing parameters as a single string rather than a structured array. This is likely a pragmatic choice for simplicity, possibly representing the raw parameter syntax before deeper parsing.

- **`indexInParent: number`** — Tracks position among siblings, enabling ordered reconstruction or sequential processing without relying on array indices alone.

- **`startLine` and `endLine` (1-indexed)** — Line numbering and the explicit note about 1-indexing suggest integration with editor/IDE tooling, which typically uses 1-indexed line numbers. The range allows content mapping back to source.

- **`content: string`** — Storing the actual text content alongside metadata indicates this is a self-contained record, useful for reconstruction, display, or validation without re-reading the original source.

## What Cannot Be Determined

- **[Language/Grammar Target]:** Whether this parser targets a specific language (TypeScript, Python, etc.) or is language-agnostic. The field names are language-agnostic, but `BlockKind` would reveal more.

- **[Use Cases]:** The specific downstream consumers—whether this is for code formatting, refactoring tools, documentation generation, static analysis, or something else entirely.

- **[Why `parameters` is a string]:** Whether storing parameters as unparsed text was a deliberate simplification or a limitation of the parsing strategy. Deeper parameter analysis might occur elsewhere.

- **[Scope reference design]:** Why `parentScope` is a string identifier rather than a numeric index or object reference—whether this enables late binding, cross-file references, or just follows a naming convention.

- **[Circular/nested structures]:** Whether blocks can be nested arbitrarily (trees) or follow a flat structure, and whether `parentScope` references can form cycles.

- **[Content completeness]:** Whether `content` includes leading/trailing whitespace, comments, decorators, or is strictly the semantic body.
