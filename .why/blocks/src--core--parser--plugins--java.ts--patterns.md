---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/java.ts::PATTERNS
file: src/core/parser/plugins/java.ts
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
  symbolic: src/core/parser/plugins/java.ts::PATTERNS
  line_range:
    start: 26
    end: 59
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:62a77c5397e48c772ce0d8a5e266192e79893f9ab9eb46ab5b5172da61f54cf0
  structural:
    kind: const
    parent_scope: module
    name: PATTERNS
    index_in_parent: 1
  semantic_fingerprint: >-
    A collection of regular expression patterns for parsing Java language constructs (classes, interfaces, enums,
    constructors, and methods) with metadata about capture groups for extracting names and parameters.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block defines a reusable pattern library for a Java code parser that identifies and extracts structural elements from Java source code. The patterns are designed to match Java declarations at the beginning of lines and capture relevant information (entity name, parameters) via regex groups. This likely exists as part of a documentation or code analysis tool that needs to traverse Java source files and identify top-level definitions and their signatures.

## Inferred Design Rationale

**Pattern Structure:** Each pattern is a structured object with `kind`, `pattern`, `nameGroup`, and optional `paramsGroup` fields (observed). This design allows the parser to:
- Identify what type of construct was matched
- Know which capture group contains the name
- Optionally extract parameters for methods/constructors

**Modifier Handling:** All patterns except constructor reference a `MODIFIERS` constant (likely a pre-built regex fragment), suggesting (inferred) that modifiers are optional and handled uniformly across different declaration types rather than hardcoded in each pattern.

**Constructor Pattern Specificity:** The constructor pattern is notably more explicit—it hardcodes visibility modifiers (`public|private|protected`) and does not reference `MODIFIERS` (observed). This likely reflects (inferred) that constructors always require explicit visibility, whereas other constructs can be default-scoped.

**Method Pattern Complexity:** The method pattern uses `(?:[\\w$<>\\[\\],.?]+\\s+)+` to capture return types, which accommodates generics (`<>`), arrays (`[]`), and wildcards (`?`) (observed). This suggests the parser targets modern Java with generics support.

**Enum Classification:** Enums are marked as `kind: 'class'` rather than `kind: 'enum'` (observed). This likely indicates (inferred) that the downstream parser treats enums as a class variant rather than a distinct structural category, or it's a bug/oversight.

**Line-start Anchoring:** All patterns use `^\\s*` (observed), meaning they only match constructs at the logical start of a line, suggesting the parser works line-by-line rather than on full AST or multi-line token streams.

## What Cannot Be Determined

**[MODIFIERS constant]:** The actual regex content of `MODIFIERS` is not visible, so we cannot verify whether all intended modifiers (abstract, final, static, etc.) are covered.

**[Downstream processing]:** Whether the captured groups are used for documentation generation, IDE features, refactoring, or another purpose is unknown.

**[Edge cases]:** Whether these patterns handle Java 15+ records, sealed classes, or other recent language features is not determinable from this block alone.

**[Multi-line handling]:** Whether the line-by-line approach handles method signatures split across multiple lines is unclear—the patterns assume the entire signature fits on one logical line.

**[Why enum uses 'class' kind]:** Whether this is intentional simplification or an oversight cannot be determined from code alone.

**[Performance constraints]:** Whether these patterns are optimized for large files or used in performance-critical contexts is unknown.

**[Test coverage]:** What Java code patterns are actually validated by tests is not visible in this block.
