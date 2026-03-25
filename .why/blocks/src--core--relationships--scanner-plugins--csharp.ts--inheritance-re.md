---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::INHERITANCE_RE
file: src/core/relationships/scanner-plugins/csharp.ts
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
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::INHERITANCE_RE
  line_range:
    start: 51
    end: 51
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:c9c37165c2d7af9aea071774a950007027eb739379b1d90a710f53bdd64e52bb
  structural:
    kind: const
    parent_scope: module
    name: INHERITANCE_RE
    index_in_parent: 9
  semantic_fingerprint: >-
    A regex pattern that extracts class/struct/record names and their base type inheritance lists from C# source code,
    capturing the type declaration and everything after the colon up to a constraint or body.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# INHERITANCE_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This regex is designed to parse C# type declarations (classes, structs, and records) and extract two key pieces of information: the name of the declared type and the list of types it inherits from or implements. This likely exists as part of a relationship scanner that builds a dependency graph or type hierarchy map by analyzing C# source files, identifying which types depend on which other types through inheritance.

## Inferred Design Rationale

**Multi-type matching (`(?:class|struct|record)`):** The pattern matches three C# type declaration keywords rather than just `class`. This is observed as deliberate, likely because structs and records can also participate in inheritance relationships (structs can implement interfaces, records can inherit from other records or classes). This suggests the tool aims for comprehensive relationship tracking across all major C# type kinds.

**Type name capture group (`(\w+)`):** Captures only word characters for the type name. This is a reasonable simplification that likely works for 99%+ of real code, though it excludes edge cases like types with special characters (which would require escaping). Likely chosen for simplicity.

**Loose intermediate content (`[\w\s<>,]*`):** Allows generic type parameters and whitespace between type name and colon without capturing. This appears designed to be permissive about formatting variations (spacing, generics like `MyClass<T>`) while keeping regex complexity manageable.

**Base types capture group (`([\w\s<>.,]+?)`):** Uses non-greedy matching (`+?`) to capture the inheritance list. This likely prevents over-capturing into `where` clauses or method bodies, stopping at the first boundary. The character set includes angle brackets for generics and commas for multiple interfaces.

**Termination boundary (`(?:\s*(?:where|\{))`):** Uses a lookahead to stop at either a `where` clause (generic constraints) or an opening brace (method body start). This is observed as a practical boundary that handles both constrained generics and non-generic types without consuming those tokens.

**Global flag (`/g`):** Applied globally, enabling extraction of multiple type declarations from a single file in one operation.

## What Cannot Be Determined

**[Correctness on edge cases]:** Whether the regex handles all valid C# syntax is unknown. Examples: Does it work with nested generic constraints like `Base<Dictionary<string, T>>`? Are there valid C# inheritance syntaxes this misses?

**[Performance characteristics]:** No way to infer whether this is performance-critical, whether it's run on large codebases requiring optimization, or if performance has ever been a concern.

**[Integration context]:** How the captured groups are used downstream is unknown—whether both capture groups are always used, whether the second group is post-processed to split interfaces, or whether it's used as-is.

**[Design alternatives]:** Why regex was chosen over a proper C# parser (like Roslyn) is unknown. This could reflect intentional simplicity, performance requirements, or lack of that dependency.

**[Maintenance history]:** Whether this regex has been iteratively refined to fix bugs or was correct-on-arrival is unknowable without history.

**[Dialect coverage]:** Whether this targets all C# versions or specific versions is unknown; newer C# features (like primary constructors, init records) might or might not be handled correctly.
