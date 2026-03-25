---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/csharp.ts::name
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
  symbolic: src/core/parser/plugins/csharp.ts::name
  line_range:
    start: 152
    end: 152
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:b74980354107ef7803bfaad9398698569b15311a862f3abe62928e5d11f52a7a
  structural:
    kind: const
    parent_scope: module
    name: name
    index_in_parent: 23
  semantic_fingerprint: >-
    Extracts the first token from a C# type name by splitting on whitespace or angle brackets, removing generic
    parameters and type qualifiers.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# name

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block extracts the base name of a C# type by removing generic type parameters (denoted by `<`) and any trailing whitespace or modifiers. For example, it would convert `List<string>` to `List` or `nullable int` to `nullable`. This appears to be part of a C# parser that needs to isolate the core type identifier for further processing or classification.

## Inferred Design Rationale

- **Regex pattern `[\s<]`:** The code splits on either whitespace or angle brackets. This is (observed) a practical approach to handle two common type annotation patterns in C#: generic types like `List<T>` and potentially nullable or modified types with spaces. This likely serves parsed type signatures that may be formatted with spaces around qualifiers.

- **Taking the first element `[0]`:** This assumes the desired identifier is always the first token after splitting, which (inferred) suggests the code expects a predictable format where the actual type name comes before any parameters or qualifiers.

- **Processing `rawName`:** The variable name suggests `name` is derived from a raw, unprocessed input string, likely from tokenization or regex matching earlier in the parser.

## What Cannot Be Determined

- **[Business Context]:** Whether this handles all valid C# type syntaxes or only a subset (e.g., does it correctly handle tuples, nullable reference types `Type?`, or other modern C# features?).

- **[Input Format Specification]:** What exact format `rawName` takes. Is it a complete type signature, a single token, or something else? Examples would clarify edge cases.

- **[Downstream Usage]:** How `name` is used after extraction—whether it's matched against a registry, used for type resolution, or something else entirely.

- **[Alternative Approaches Considered]:** Why regex splitting was chosen over other parsing strategies (e.g., finding the first `<` index, using a proper C# parser library).

- **[Performance Requirements]:** Whether this needs to handle extremely large type names or is performance-sensitive.
