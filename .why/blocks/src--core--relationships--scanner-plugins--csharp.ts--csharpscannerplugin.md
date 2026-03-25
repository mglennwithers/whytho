---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::csharpScannerPlugin
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
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::csharpScannerPlugin
  line_range:
    start: 53
    end: 113
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f3c4384c520cb5685712c545784e0380d1ffcf2f5abb5ddd1d10216b72a71e1c
  structural:
    kind: const
    parent_scope: module
    name: csharpScannerPlugin
    index_in_parent: 10
  semantic_fingerprint: >-
    A C# source file scanner that extracts static dependencies, instantiations, and inheritance relationships by
    regex-matching using directives, method calls, object construction, and class declarations, then resolves them
    against a registry of known types.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# csharpScannerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This plugin enables dependency analysis for C# codebases by scanning `.cs` files and identifying three categories of relationships: runtime dependencies (method calls and instantiations), inheritance chains, and interface implementations. It distinguishes between production code dependencies and test dependencies based on file naming conventions, allowing downstream systems to build directed relationship graphs for architectural analysis or impact assessment.

## Inferred Design Rationale

**Regex-based pattern matching over AST parsing:** The code uses multiple regex patterns (`USING_RE`, `STATIC_CALL_RE`, `INSTANTIATION_RE`, `INHERITANCE_RE`) rather than parsing a syntax tree. This likely trades precision for simplicity and performance—regex is faster to execute and requires fewer external dependencies, though it may miss edge cases (e.g., generics, nested types). (Observing)

**Namespace-segment-based type resolution:** Instead of fully qualified name matching, the scanner extracts only the last segment of namespaces from `using` directives and passes them to `findRegistryEntriesForType()`. This appears designed to handle common C# patterns where types are imported via `using` statements, though it likely struggles with name collisions across namespaces. (Inferring)

**Deduplication via `seenTargets` set:** The code maintains a set keyed by `${type}:${candidate}` to prevent emitting duplicate edges. This suggests either (a) the regex patterns can match the same relationship multiple times, or (b) the design anticipates future modifications that could generate duplicates. (Inferring)

**Differentiated edge metadata for inheritance:** For inheritance/interface relationships, the code uses `sourceBlock: "${filePath}::${declaringClass}"` (class-scoped) whereas dependencies use `sourceFile: filePath` (file-scoped). This likely reflects that inheritance is semantically tied to a specific class definition, while dependencies are file-level concerns. (Inferring)

**Interface detection via naming convention:** The check `/^I[A-Z]/.test(base)` assumes interfaces follow the `.NET naming convention` of starting with `I`. This is a reasonable heuristic for C# but is brittle—it cannot distinguish actual interfaces from coincidentally-named classes. (Observing)

**Early exit on empty namespaces:** The function returns `[]` if no using directives are found. This assumes that files without imports have no resolvable dependencies, which may miss base class library types or unqualified type references. (Inferring)

## What Cannot Be Determined

**[Regex pattern definitions]:** The actual patterns matched by `USING_RE`, `STATIC_CALL_RE`, `INSTANTIATION_RE`, and `INHERITANCE_RE` are not shown. Without seeing these, it's impossible to assess false positive/negative rates, handling of C# syntax variations (e.g., `global::` prefixes, nullable types with `?`, tuples), or whether they handle comment/string-embedded code correctly.

**[Registry lookup behavior]:** The `findRegistryEntriesForType()` function's implementation is unknown. It may perform fuzzy matching, exact matching, or search across multiple namespace contexts—this directly affects which relationships are discovered and whether the namespace-segment heuristic is sufficient.

**[Test file detection criteria]:** The `isTestFile()` function's logic is not visible. Different projects classify tests differently (suffix patterns like `Tests.cs`, `Test.cs`, folder location, project naming), and this choice significantly impacts the `depends_on` vs. `tests` classification.

**[BlockRegistry structure and contents]:** What constitutes a "block" in the registry, how it's populated, and whether it only contains analyzed project code or also external dependencies, is unknown. This affects which relationships resolve successfully.

**[Performance constraints]:** There is no context on file size limits, timeout requirements, or whether regex execution is optimized (e.g., via precompiled patterns, anchors, or early termination).

**[Business rules for relationship filtering]:** Why certain relationship types (`depends_on`, `tests`, `implements`, `extends`) were chosen and whether there are implicit rules about which relationships to emit (e.g., filtering standard library types) is not clear.

**[Generic type handling]:** The code does `.split('<')[0].trim()` to strip generics from base types, but there's no indication of whether this is sufficient for complex scenarios like nested generics or generic constraint syntax.
