---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/java.ts::EXTENDS_RE
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
  symbolic: src/core/relationships/scanner-plugins/java.ts::EXTENDS_RE
  line_range:
    start: 24
    end: 24
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:25929981524c7262e299d5b7a6405e95b18e792f4e9ad9258422f734918a84cf
  structural:
    kind: const
    parent_scope: module
    name: EXTENDS_RE
    index_in_parent: 4
  semantic_fingerprint: >-
    A global regex pattern that matches Java class declarations with their parent class specified via the `extends`
    keyword, capturing both the child class name and the parent class name.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# EXTENDS_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This regex constant extracts inheritance relationships from Java source code by identifying class declarations that extend another class. It captures two groups: the name of the class being declared and the name of its parent class. This appears to be part of a dependency or relationship scanning system for Java codebases, likely used to build a graph of class hierarchies or inheritance chains.

## Inferred Design Rationale

- **Global flag (`/g`)**: Indicates the pattern is meant to match multiple occurrences within a single source file, not just the first match. This is observed and makes sense for scanning an entire Java file for all class hierarchies.

- **Word boundary (`\b`) at start**: Ensures "class" is a keyword, not part of another identifier. This is a necessary safeguard to avoid false matches on strings like "myclass" or "subclassName".

- **Flexible whitespace (`\s+`)**: Allows for variable spacing between "class", the class name, and "extends". This is observed and pragmatic for handling different coding styles.

- **Character class for identifiers (`\w+`)**: Captures simple Java identifiers. This appears sufficient for class names but likely cannot handle generic type parameters (e.g., `class Foo<T> extends Bar<T>`).

- **Negated character class (`[^{]*`)**: Skips over annotations, modifiers, and generics between the class name and "extends" keyword. This is a likely design choice to tolerate realistic Java syntax without building a full parser.

- **Dot notation in parent class (`[\w.]+`)**: Allows fully-qualified class names like `java.lang.Object`. This is observed and necessary for Java's package system.

## What Cannot Be Determined

- **[Business Context]:** Whether this scanner is part of a static analysis tool, IDE plugin, dependency analyzer, or documentation generator.

- **[Scope of Use]:** Whether this regex is used on raw source text, tokenized input, or preprocessed code (e.g., with comments removed).

- **[Performance Requirements]:** Whether performance for large codebases or real-time scanning was a design constraint.

- **[Generic Type Handling]:** Why generics are not captured (e.g., `extends ArrayList<String>`). This could be a deliberate simplification or an oversight.

- **[Interface Implementation]:** Why only `extends` is matched and not `implements`. This may indicate interfaces are handled separately, or they're out of scope.

- **[Inner/Anonymous Classes]:** Whether the regex is expected to handle inner classes or anonymous class extensions.

- **[Historical Alternatives]:** What parsing approaches were considered before settling on regex (e.g., full AST parsing).
