---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::BlockRegistry
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.45
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::BlockRegistry
  line_range:
    start: 45
    end: 45
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:e3b43fc135b2624f9e89ec1f8906f55a0208fb7d9bfaa0698f9c3524c18483eb
  structural:
    kind: type
    parent_scope: module
    name: BlockRegistry
    index_in_parent: 1
  semantic_fingerprint: >-
    A type alias defining a bidirectional mapping structure using Map with string keys and string values, likely used to
    track relationships between block identifiers and their associated names or references within a scanning system.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# BlockRegistry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **45%**

## Purpose

This type alias defines the shape of a registry data structure for storing block metadata. Based on the file path (`relationships/scanner.ts`), it likely maintains a mapping of block identifiers to their corresponding values (possibly names, types, or references) during some form of code scanning or relationship analysis operation. The registry probably serves as a central lookup table that accumulates data as the scanner traverses code structures.

## Inferred Design Rationale

- **Map over Object:** The choice of `Map<string, string>` over a plain object (`Record<string, string>`) suggests the code likely needs Map-specific features—possibly iteration order preservation, dynamic key management, or use of non-string keys elsewhere in related code. *(inference)*

- **String keys and values:** Both the key and value are constrained to strings, indicating this registry stores simple, text-based identifiers rather than complex objects. This suggests either a lightweight lookup table or a simplified intermediate representation. *(observation)*

- **Simple type alias:** The lack of branded typing or literal types indicates this is a generic, reusable structure without domain-specific constraints at the type level. *(observation)*

## What Cannot Be Determined

- **[Semantic meaning of entries]:** What specific string values are stored, what they represent (names, IDs, file paths, type information), or the naming conventions used for keys.

- **[Lifecycle and mutation patterns]:** Whether this registry is built incrementally during scanning, cleared between scans, or persisted; who owns and mutates it; whether it supports deletions.

- **[Relationship to other types]:** How this registry connects to the broader "relationships" and "scanner" concepts in the codebase, what other types depend on it, or how it interfaces with scanning logic.

- **[Business/domain context]:** What problem in block analysis this solves, why blocks need relationship tracking, or what downstream systems consume this data.

- **[Performance requirements]:** Whether lookup speed, memory efficiency, or insertion order matters for the intended use case.
