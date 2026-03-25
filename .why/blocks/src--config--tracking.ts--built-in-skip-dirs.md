---
whytho: "1.0"
type: block
symbolic_ref: src/config/tracking.ts::BUILT_IN_SKIP_DIRS
file: src/config/tracking.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:00.729Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/config/tracking.ts::BUILT_IN_SKIP_DIRS
  line_range:
    start: 6
    end: 9
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:208121c37eacee803e8a4d5812c973f1f97732835d422375f0bd35f22ac451a5
  structural:
    kind: const
    parent_scope: module
    name: BUILT_IN_SKIP_DIRS
    index_in_parent: 0
  semantic_fingerprint: >-
    A built-in exclusion list for directory traversal operations, containing common development artifacts and dependency
    directories across multiple ecosystems (Node.js, Git, Python, Next.js, Nuxt, etc.). Exported as a Set for efficient
    lookup during file system scanning.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# BUILT_IN_SKIP_DIRS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This block defines a hardcoded set of directory names that should be skipped during some form of file system traversal or analysis operation. The module name "tracking" and the export naming convention suggest this is part of a larger system that scans or monitors a project's file structure. These directories are excluded because they typically contain auto-generated files, dependencies, or build artifacts that are not relevant to the tracking/analysis logic.

## Inferred Design Rationale

**Use of `Set` data structure (observed):** A Set is used instead of an array, indicating the code performs frequent membership checks (e.g., `has()` lookups) during traversal. This is a performance-conscious choice for O(1) lookup time versus O(n) for arrays.

**Ecosystem diversity (observed):** The list covers multiple language/framework ecosystems—Node.js (`node_modules`, `.next`, `.nuxt`), Git (`.git`), Python (`__pycache__`), and generic build directories (`dist`, `build`, `out`). This suggests the tool is language-agnostic or multi-project-aware.

**Named "BUILT_IN" prefix (observed):** The naming suggests these are default exclusions, with an implication that user-defined skip directories can be added elsewhere (likely a separate configuration).

**Export visibility (observed):** Public export indicates other modules depend on this list, either to extend it, reference it, or use it directly in traversal logic.

## What Cannot Be Determined

**[Performance criticality]:** Whether the Set is used in hot loops millions of times per second or checked only occasionally; this affects whether the Set choice is truly justified.

**[Completeness criteria]:** Whether this list is intentionally exhaustive for supported ecosystems or if it's a minimum viable set; whether omissions are deliberate or represent gaps.

**[User configuration mechanism]:** How (or if) users can extend or override this list; whether there's a merge strategy with custom skip directories.

**[Historical evolution]:** Why specific directories were chosen (e.g., `.why` is unusual—unclear if it's a specific tool or legacy entry).

**[Operational context]:** What the parent "tracking" module actually does—whether it's for dependency analysis, code coverage, file watching, security scanning, or something else entirely.

**[`.cache` and `.why` justification]:** These are less obvious than others; `.cache` could be multiple tools, and `.why` is not a standard directory pattern in any major ecosystem.
