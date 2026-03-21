---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::AnyFrontmatter
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T11:35:35.961Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::AnyFrontmatter
  line_range:
    start: 145
    end: 149
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:cbede35f6805658a505851ea2e79c91db625f52894a2a5f5f11b07ecad03b6b3
  structural:
    kind: type
    parent_scope: module
    name: AnyFrontmatter
    index_in_parent: 16
  semantic_fingerprint: >-
    A union type that aggregates four distinct frontmatter variants (Session, Folder, File, and Block), enabling
    polymorphic handling of metadata across different structural levels in the codebase.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# AnyFrontmatter

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This type definition creates a discriminated union of four frontmatter types, allowing functions and variables to accept any one of these metadata formats interchangeably. It likely exists to support a system where different hierarchical or contextual levels (sessions, folders, files, blocks) each carry their own metadata structure, and code needs to handle them uniformly without type-checking at every usage point.

## Inferred Design Rationale

- **Union-based polymorphism (observed):** The type uses TypeScript's union syntax rather than inheritance or interfaces with optional fields, suggesting the developer wanted strict type safety where each variant is complete and unambiguous rather than allowing partial implementations.

- **Four-tier structural hierarchy (inferred):** The names suggest a hierarchy or organizational system—Session (top-level context), Folder (directory grouping), File (document unit), and Block (sub-document fragment). The type likely serves as an abstraction layer across these levels.

- **No explicit discriminator field (observed):** The union relies on structural differences between the four types rather than a literal discriminator property, which implies either: (a) the component types have sufficiently distinct shapes that TypeScript can narrow them unambiguously, or (b) callers are expected to manage type narrowing externally.

## What Cannot Be Determined

- **[Runtime usage patterns]:** Whether this type is used in switch statements, discriminated unions with type guards, or generic functions—the actual consumption pattern is invisible.

- **[Component type definitions]:** What fields, optional properties, or behaviors distinguish `SessionFrontmatter`, `FolderFrontmatter`, `FileFrontmatter`, and `BlockFrontmatter` from each other, and whether they share common properties.

- **[Business domain]:** Whether this is for documentation, note-taking, content management, or another domain entirely.

- **[Historical alternatives]:** Why this union approach was chosen over an interface with discriminator literals (e.g., `{ type: "session" | "folder" | "file" | "block" } & (...)`) or a class hierarchy.

- **[Frequency of all-four handling]:** Whether code typically handles all four variants equally or whether some branches strongly prefer specific types.
