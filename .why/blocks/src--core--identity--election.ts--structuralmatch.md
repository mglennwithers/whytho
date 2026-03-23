---
whytho: "1.0"
type: block
symbolic_ref: src/core/identity/election.ts::structuralMatch
file: src/core/identity/election.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:01.710Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/identity/election.ts::structuralMatch
  line_range:
    start: 23
    end: 29
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:0d6463c4057607e80eb2642a6886866e70f2754d519f38b0b86ed4e44dca51fa
  structural:
    kind: function
    parent_scope: module
    name: structuralMatch
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Compares two code entities (a stored structural position and a candidate parsed block) by checking equality across
    three structural attributes: kind, parent scope, and name. This function serves as an identity matcher for code
    block reconciliation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/core/types.ts::StructuralPosition
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
---

# structuralMatch

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function determines whether a stored code structure matches a newly parsed code block by comparing three key identity properties. It likely exists as part of a larger identity/election system (inferred from the filename and module path) that tracks code elements across parse cycles or versions, possibly to detect refactoring, moves, or structural changes. The function appears to be a predicate used for matching or lookup operations.

## Inferred Design Rationale

- **Three-property comparison model**: The function checks `kind`, `parent_scope`, and `name` as a composite identity. This suggests these three attributes together uniquely identify a code element within a system. (Observing the code structure)

- **Property name normalization**: The stored object uses snake_case (`parent_scope`) while the candidate uses camelCase (`parentScope`), indicating these objects come from different layers (likely database/serialized format vs. in-memory parsed format). This is probably intentional to support serialization/deserialization workflows. (Inferring from naming pattern)

- **Equality-based matching rather than fuzzy matching**: The function uses strict equality rather than similarity scoring, suggesting the system requires deterministic, binary match outcomes. This probably means false positives are costly. (Inferring from simplicity)

- **Immutability implied**: The function takes no actions on its parameters, only reads them, suggesting it's designed as a pure function suitable for filtering, searching, or assertion contexts. (Observing code behavior)

## What Cannot Be Determined

- **[Scope of identity]:** Whether these three properties (`kind`, `parent_scope`, `name`) are guaranteed to uniquely identify a code element globally, per-file, or per-scope. This determines what "match" semantically means.

- **[Election system context]:** What "election" refers to in the module name—whether it's conflict resolution, version selection, or something domain-specific to this codebase's architecture.

- **[Candidate source]:** Whether `candidate` objects are always freshly parsed or might be cached/stale, which affects whether false negatives in matching indicate genuine structural changes.

- **[Usage pattern]:** Whether this function is used in hot paths requiring optimization, or in initialization/infrequent operations, which would affect acceptable performance trade-offs.

- **[Failure semantics]:** What happens when a match fails—is it logged, does it trigger reconciliation, removal, or is it simply used for filtering?

- **[Historical rationale]:** Why parent_scope and kind are necessary alongside name (e.g., whether name alone is insufficient due to shadowing or name reuse patterns in the target language).
