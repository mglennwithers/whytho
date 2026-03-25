---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/generic.ts::BlockPattern
file: src/core/parser/plugins/generic.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:33.197Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/generic.ts::BlockPattern
  line_range:
    start: 4
    end: 9
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:37370c2f1c4b065be754f467c9b48c60b7f0b9952fe9aa4cb16d3bc344a5f405
  structural:
    kind: interface
    parent_scope: module
    name: BlockPattern
    index_in_parent: 0
  semantic_fingerprint: >-
    Defines a configuration interface for matching and extracting structured block patterns using regular expressions,
    capturing block type, pattern matching rules, and named group indices for parsing block names and parameters.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/types.ts::BlockKind
    source: ai
---

# BlockPattern

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the schema for a block pattern matcher used in a generic parser plugin. It specifies how to identify and extract components (name, parameters) from textual blocks by matching against a regular expression pattern and designating which capture groups contain relevant data. The interface likely serves as a configuration template that the parser uses to recognize different types of code or markup blocks.

## Inferred Design Rationale

- **`kind: BlockKind`** (OBSERVED): A discriminator field suggesting that blocks have different types/categories. This appears designed to support multiple block variants while reusing the same pattern-matching infrastructure.

- **`pattern: RegExp`** (OBSERVED): Uses compiled regular expressions rather than string patterns, likely chosen for performance (avoid repeated compilation) and to support complex matching logic that simple string matching cannot achieve.

- **`nameGroup: number`** (OBSERVED): Mandatory field indicating a capture group index for extracting block names. This appears to be required because name extraction is fundamental to the parser's operation.

- **`paramsGroup?: number`** (OBSERVED): Optional field suggesting that some blocks may not have parameters or parameter extraction may not always be needed. This design allows flexibility for simpler block types that don't require parameter parsing.

- **Numeric group references** (INFERRED): The choice of numeric indices rather than named capture groups likely reflects either compatibility requirements with older JavaScript environments, or a design preference for compact configuration objects.

## What Cannot Be Determined

- **[Business Context]:** What specific block types this parser handles (code blocks, markdown blocks, template syntax, etc.) or what domain/language this targets.

- **[BlockKind values]:** The enumeration of valid `BlockKind` values and their semantics.

- **[Group indexing convention]:** Whether group numbering is 0-indexed or 1-indexed, or if there are documented conventions for multi-group patterns.

- **[Integration points]:** How this interface is consumed—whether multiple BlockPatterns are composed into a registry, how they're prioritized during matching, or error handling when patterns conflict.

- **[Regex complexity constraints]:** Whether there are performance or complexity expectations for the `pattern` field, or guidance on what regex features are supported.

- **[Historical alternatives]:** Why object-based configuration was chosen over class-based pattern builders or other architectural approaches.
