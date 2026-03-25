---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/java.ts::INSTANTIATION_RE
file: src/core/relationships/scanner-plugins/java.ts
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
  symbolic: src/core/relationships/scanner-plugins/java.ts::INSTANTIATION_RE
  line_range:
    start: 21
    end: 21
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:7148a013454437169fa29f76aab9f0ae8e8a507d35abe5c6531c1e7f67f52525
  structural:
    kind: const
    parent_scope: module
    name: INSTANTIATION_RE
    index_in_parent: 3
  semantic_fingerprint: >-
    A regular expression that matches Java `new` keyword instantiations followed by a class name and generic type
    parameters or constructor arguments, capturing the class name for extraction.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# INSTANTIATION_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This regex pattern is designed to identify and extract class names from Java object instantiation expressions. It matches the `new` keyword followed by a class identifier and either angle brackets (generic type parameters like `<String>`) or parentheses (constructor arguments), capturing just the class name itself. Given the file path indicates this is a Java scanner plugin for analyzing relationships, this likely extracts class dependencies created through direct instantiation so they can be tracked in a dependency graph.

## Inferred Design Rationale

- **Global flag (`/g`):** The pattern uses global matching, indicating the intent to find all instantiations in a source file, not just the first occurrence. This is observed and standard practice for scanning/linting tools.

- **Word boundary (`\b`):** The `\b` anchor before `new` ensures matching only the keyword `new` as a complete token, avoiding false matches within identifiers like `renewable`. This is observed and prevents incorrect captures.

- **Whitespace flexibility (`\s+`):** The pattern requires at least one whitespace character between `new` and the class name, matching Java's syntax requirements. This is observed.

- **Class name capture group (`(\w+)`):** Only word characters are captured, which correctly matches Java identifiers but likely assumes no nested generics or fully-qualified names (e.g., `com.example.ClassName`). This is inferred as a simplification choice, though it's unclear if qualified names were intentionally excluded or simply not yet needed.

- **Lookahead for type parameters or arguments (`[<(]`):** The pattern requires either `<` or `(` immediately after the class name (with optional whitespace), which correctly distinguishes instantiations from other uses of `new` (though this may miss edge cases). This is observed.

## What Cannot Be Determined

- **[Business Context]:** Why this specific file needs to track Java instantiation relationships—whether for dependency analysis, impact analysis, or unused code detection.

- **[Qualified Names]:** Whether the single `\w+` capture is intentional (only simple class names) or whether the code later processes qualified names separately. The regex will fail to capture `new com.example.MyClass<String>()` as a complete entity.

- **[Performance Requirements]:** Whether this regex is expected to run on large codebases and if performance was a design consideration.

- **[False Positive Tolerance]:** How the consuming code handles edge cases like `new int[5]` (array instantiation) or inner classes like `new Outer.Inner()`, which this regex may or may not match correctly depending on whitespace.

- **[Alternative Approaches]:** Why regex was chosen over AST-based parsing, which would be more robust for Java analysis.
