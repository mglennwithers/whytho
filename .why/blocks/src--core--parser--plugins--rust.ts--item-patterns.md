---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/rust.ts::ITEM_PATTERNS
file: src/core/parser/plugins/rust.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/rust.ts::ITEM_PATTERNS
  line_range:
    start: 38
    end: 69
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:f262994d0bd8cacb65d274e485f8edfa6f3e2d0e456d51af71712c5944e1848a
  structural:
    kind: const
    parent_scope: module
    name: ITEM_PATTERNS
    index_in_parent: 2
  semantic_fingerprint: >-
    Defines regex patterns to identify and extract Rust language structural items (structs, traits, enums, type aliases,
    constants) with their visibility modifiers and names for code parsing and documentation generation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# ITEM_PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This constant defines a mapping array that associates Rust language constructs with their documentation model equivalents. It enables a parser to recognize lines of Rust code that declare top-level items (structs, traits, enums, type aliases, constants), extract their names, and classify them for documentation purposes. This is likely part of a code documentation or AST analysis tool that needs to identify and categorize Rust declarations.

## Inferred Design Rationale

**Pattern-based matching approach:** Each item uses a regex pattern rather than a full parser. This is likely a pragmatic choice for lightweight, line-by-line scanning rather than full syntactic analysis—suitable for documentation extraction where only declaration names matter, not full AST construction. (Observed)

**Kind mapping to documentation model:** Rust constructs are mapped to simplified kinds ('class', 'interface', 'type', 'const') that likely correspond to documentation system abstractions. `struct` → 'class' and `trait` → 'interface' suggests the system models Rust semantics in terms of OOP-style documentation. (Inferred)

**Visibility modifier prefix (`${VIS}`):** All patterns include a variable `VIS` likely containing visibility keywords (pub, pub(crate), etc.). This allows matching declarations regardless of visibility level, which is necessary since visibility doesn't affect whether an item should be documented. (Inferred)

**Consistent nameGroup extraction:** Every pattern uses `nameGroup: 1`, indicating the first capture group always holds the identifier name. This regularity suggests code generation or template-based pattern construction. (Observed)

**Ordered placement:** The specific sequence (struct, trait, enum, type, const) has no apparent semantic significance, though conventional ordering may aid pattern-matching efficiency or readability. (Uncertain)

## What Cannot Be Determined

**[VIS definition]:** The exact regex content of `VIS` is not visible; it's unclear whether it permits multiple visibility keywords, generic visibility parameters like `pub(path)`, or only standard variants.

**[Pattern matching strategy]:** Unknown whether patterns are applied in sequence (first match wins) or all patterns are tested. This affects behavior when lines could match multiple patterns (unlikely for Rust, but architecturally important).

**[Line-anchored design]:** Unclear why patterns use `^\\s*` (line start) rather than supporting mid-file declarations or why newline boundaries are assumed necessary.

**[Business context]:** Whether this is for documentation generation, IDE features, linting, or code metrics analysis. The kind mappings suggest documentation, but this is inferred rather than certain.

**[Performance requirements]:** No indication of whether these patterns are compiled once or repeatedly, whether there are scaling concerns with file size, or whether regex performance was optimized.

**[Historical alternatives]:** Unknown whether a full Rust parser library was considered and rejected, or if regex-based matching was the original design choice.
