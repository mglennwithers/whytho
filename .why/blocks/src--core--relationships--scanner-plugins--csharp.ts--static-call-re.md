---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::STATIC_CALL_RE
file: src/core/relationships/scanner-plugins/csharp.ts
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
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::STATIC_CALL_RE
  line_range:
    start: 45
    end: 45
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4b90254b06564565522b9236fdcdcc3a908b436f6bc7a7f7fa53a0f2334394b5
  structural:
    kind: const
    parent_scope: module
    name: STATIC_CALL_RE
    index_in_parent: 7
  semantic_fingerprint: >-
    A regular expression that identifies static method calls in C# code by matching a capitalized class name followed by
    a method name and opening parenthesis or angle bracket, with global matching enabled.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# STATIC_CALL_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This regex pattern is designed to detect static method invocations in C# source code. It captures two groups: a class name (starting with an uppercase letter) and a method name, followed by either a parenthesis or angle bracket (indicating method invocation or generic type parameters). This likely exists as part of a dependency scanner that analyzes C# code to build a relationship graph of static method calls, helping identify cross-module or cross-namespace dependencies.

## Inferred Design Rationale

- **Uppercase first character requirement (`[A-Z]`):** Observing C# naming conventions, this assumes class names are PascalCased and start with uppercase. This is a strong convention in C# and helps distinguish class references from variable names. Likely included to reduce false positives.

- **Two capture groups:** The pattern separates the class identifier from the method identifier, probably to enable independent processing of each component (e.g., resolving the class name to a module and tracking the specific method being called).

- **Global flag (`/g`):** Observing the trailing `g`, this enables finding all matches in a file rather than just the first occurrence, which is necessary for comprehensive dependency discovery.

- **Character class `\w+` for method names:** Appears to accept alphanumeric characters and underscores, which covers standard C# method naming. Does not attempt to validate against reserved keywords.

- **Lookahead for `[(<]`:** The pattern terminates with either `(` or `<`, likely to distinguish method calls from property access. The angle bracket probably handles generic method syntax like `ClassName.Method<T>()`.

## What Cannot Be Determined

- **[Scope of analysis]:** Whether this regex is intended to match only static calls or if it also captures instance method calls on class instances—the pattern doesn't explicitly enforce static context.

- **[False positive handling]:** Whether downstream code validates that matched class names are actually classes (vs. namespaces or other identifiers that happen to be capitalized).

- **[Generic type parameters]:** How the pattern handles complex generic syntax (e.g., `Class.Method<List<string>>()`) or nested generics beyond the initial `<`.

- **[Performance context]:** Whether this regex is applied to large codebases or single files, and if performance optimization was a consideration.

- **[Edge cases in C#]:** Whether the pattern accounts for extension methods, nested classes, or fully-qualified names (e.g., `Namespace.ClassName.Method()`).
