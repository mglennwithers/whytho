---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/java.ts::endLine
file: src/core/parser/plugins/java.ts
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
  symbolic: src/core/parser/plugins/java.ts::endLine
  line_range:
    start: 115
    end: 115
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:afb4441e9e82d68305de2f88b9e70926031330a1f5c57f68249969cae61bbab0
  structural:
    kind: const
    parent_scope: module
    name: endLine
    index_in_parent: 22
  semantic_fingerprint: >-
    Determines the ending line number of a Java code block by checking for opening braces; if present, finds the
    matching block end, otherwise uses the next line.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# endLine

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This code calculates where a Java construct (likely a method, class, or control structure) ends. It appears to be part of a parser that processes Java source code line-by-line. The block distinguishes between two cases: constructs with braces (which may span multiple lines and require bracket matching) and constructs without braces (which end on the next line). This distinction is necessary because Java syntax requires explicit brace matching for blocks, but some statements can exist on a single line.

## Inferred Design Rationale

**Conditional brace detection:** The code observes whether the current `line` contains a `{` character. This is likely because Java blocks (methods, classes, loops, conditionals) typically open with `{`. (Observed)

**Dual path resolution:** If a brace exists, it delegates to `findBlockEnd(lines, i)` to locate the matching closing brace, suggesting `findBlockEnd` performs bracket-matching logic. If no brace exists, it simply returns `i + 1`, implying the construct is single-line. (Inferred)

**Array indexing context:** The parameter `i` appears to be the current line index in a `lines` array, and the function returns a line number. (Observed)

## What Cannot Be Determined

**[Purpose of parser]:** Whether this is for syntax highlighting, code analysis, refactoring, documentation generation, or another use case.

**[Block types covered]:** Whether this handles all Java constructs (anonymous classes, lambdas, nested blocks) or only common ones; edge cases like string literals containing `{` are not visible.

**[findBlockEnd implementation]:** The actual bracket-matching algorithm—whether it handles nested braces, comments, string escaping, or other complexities.

**[Error handling]:** What happens if `findBlockEnd` fails to find a closing brace (unmatched braces); no error handling is visible here.

**[Line array structure]:** Whether `lines` contains raw source or preprocessed content (e.g., comments/strings already stripped).
