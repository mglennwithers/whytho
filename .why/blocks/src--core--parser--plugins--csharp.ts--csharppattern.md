---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/csharp.ts::CSharpPattern
file: src/core/parser/plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/csharp.ts::CSharpPattern
  line_range:
    start: 19
    end: 24
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:c7a162d899a563d45a7e645faf7d1d52e84dabf561a780e9fa644288f8f19edc
  structural:
    kind: interface
    parent_scope: module
    name: CSharpPattern
    index_in_parent: 0
  semantic_fingerprint: >-
    Configuration interface that maps C# code constructs to regex patterns and capture group indices for extracting
    block metadata during parsing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# CSharpPattern

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the structure for C# parsing rules within a plugin architecture. It appears to specify how the parser should recognize C# code blocks (like methods, classes, properties) by providing a regex pattern and indicating which capture groups contain the block name and parameters. The interface likely exists to standardize the format for declaring multiple parsing patterns in a C# language plugin.

## Inferred Design Rationale

- **`kind: BlockKind`** — Categorizes the type of code construct being matched (observed: enum/type reference), likely distinguishing between methods, classes, properties, etc. This allows different handling logic downstream.

- **`pattern: RegExp`** — The regex pattern that identifies C# syntax (observed: explicitly RegExp type). This suggests a regex-based parsing approach rather than AST-based, probably chosen for simplicity and performance.

- **`nameGroup: number`** — Required field specifying which regex capture group (by index) contains the block's identifier name (observed: non-optional). This is essential for extracting meaningful identifiers from matched patterns.

- **`paramsGroup?: number`** — Optional field for identifying the capture group containing parameters (observed: optional via `?`). The optionality suggests not all block types have extractable parameters, or parameter extraction is not always needed.

- **Grouping by capture indices rather than named groups** — Likely chosen for simplicity and broad regex engine compatibility, though this makes patterns less self-documenting (inferring trade-off).

## What Cannot Be Determined

- **[Business Context]:** Why C# specifically requires a plugin (vs. built-in support) or what documents/files are being parsed.

- **[Pattern Examples]:** What actual regex patterns look like or which C# constructs are supported (methods, async methods, properties, nested classes, etc.).

- **[BlockKind Enum]:** What values BlockKind contains and whether they map 1-to-1 with CSharpPattern instances or if multiple patterns can share the same kind.

- **[Downstream Usage]:** How these capture groups are processed after extraction (validation, formatting, storage, etc.).

- **[Performance Implications]:** Whether this regex-based approach scales adequately or if there are plans to migrate to AST-based parsing.

- **[Naming Rationale]:** Why "paramsGroup" is optional—whether this reflects language design constraints or implementation choices not yet required.
