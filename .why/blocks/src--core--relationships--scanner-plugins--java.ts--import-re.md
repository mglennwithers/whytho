---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/java.ts::IMPORT_RE
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
  symbolic: src/core/relationships/scanner-plugins/java.ts::IMPORT_RE
  line_range:
    start: 11
    end: 11
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:9e69679e89072197a0e0dd6e71979120e1341033d94052f8030b04d2b9b0b63d
  structural:
    kind: const
    parent_scope: module
    name: IMPORT_RE
    index_in_parent: 1
  semantic_fingerprint: >-
    A regular expression that extracts Java import statements, capturing the package/class name while handling optional
    static imports and wildcard syntax.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# IMPORT_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This regex pattern is designed to parse Java import declarations from source code and extract the imported package or class name. It likely exists within a Java dependency scanner that needs to identify what external packages or classes a Java file depends on. The pattern captures the import target (e.g., `java.util.List` or `com.example.MyClass`) while ignoring syntactic variations like static imports and wildcard imports.

## Inferred Design Rationale

- **Multiline global matching (`/gm` flags):** Observed. The regex operates on entire source files containing multiple import statements, requiring the global flag to find all matches and multiline mode to handle imports at any line position (not just start of string).

- **Optional static keyword (`(?:static\s+)?`):** Observed. Java supports both regular imports (`import java.util.*;`) and static imports (`import static java.lang.Math.PI;`). The non-capturing group makes static optional, suggesting the scanner needs to handle both forms.

- **Capturing group for package/class name (`([\w.]+)`):** Observed. Only the actual imported entity is captured—the parentheses create a capture group (group 1) that downstream code likely uses to extract the dependency. The `[\w.]+` pattern matches Java qualified names (letters, digits, underscores, dots).

- **Optional wildcard handling (`(?:\.\*)?`):** Observed. The pattern permits (but doesn't capture) wildcard imports like `import java.util.*;`. The non-capturing group suggests wildcards are recognized but not differentiated in the output, likely because the scanner treats them as "import from package X" rather than needing the exact wildcard syntax.

- **Anchored to line start with whitespace tolerance (`^\s*`):** Observed. This likely prevents false positives from imports within comments or string literals, though this protection is incomplete (it won't filter imports in multi-line comments).

## What Cannot Be Determined

- **[Downstream processing]:** How captured group 1 is used—whether it's filtered, normalized, resolved against a classpath, or stored as-is. Whether wildcard imports are processed separately (e.g., by listing all public classes in that package).

- **[Scope of use]:** Whether this regex is applied to all Java source files, generated code, test files, or a filtered subset. Whether performance (regex efficiency) was a consideration for large codebases.

- **[False positive tolerance]:** Whether the incomplete comment-filtering (e.g., imports in `/* ... */` blocks will still match) is acceptable or if upstream preprocessing strips comments first.

- **[Historical alternatives]:** Why a regex approach was chosen over a proper Java parser (AST-based), and whether performance, simplicity, or dependencies drove this decision.

- **[Captured data semantics]:** Whether the intent is to extract module dependencies, detect license obligations, find unused imports, or populate a different kind of relationship graph.
