---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::runStaticScan
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T02:10:30.088Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::runStaticScan
  line_range:
    start: 110
    end: 254
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:83351c61a6baf5929f0e894649a3ae39ad56439db4a88c50d2034b85062a5f81
  structural:
    kind: function
    parent_scope: module
    name: runStaticScan
    parameters: (4 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    A three-pass static code scanner that builds a registry of code blocks, detects relationships between files and
    blocks, and persists those relationships to annotation files while preserving manually-authored edges.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# runStaticScan

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function performs a static analysis scan across a repository to discover relationships (dependencies, references, etc.) between code blocks and files. It separates discovered relationships into two categories: block-level edges (relationships originating from specific named blocks) and file-level edges (relationships originating from files as a whole). The function then persists these relationships to annotation files while preserving non-static relationships (marked as 'ai' or undefined source), effectively maintaining a curated audit trail of code structure.

## Inferred Design Rationale

**Multi-pass architecture (Observed):** The code explicitly uses three numbered passes:
- Pass 1 builds a registry mapping block references to file paths
- Pass 2 scans files using language-specific plugins and accumulates edges by type
- Pass 3 writes edges back, with separate logic for blocks vs. files

This separation likely enables efficient re-scanning without re-parsing annotation files during discovery.

**Two-accumulator pattern (Observed):** Edges are segregated into `edgesByBlock` (keyed by `sourceBlock`) and `edgesByFile` (keyed by `sourceFile`) during collection, then written via separate code paths. This likely reflects a fundamental domain distinction where block-level relationships have different metadata or persistence semantics than file-level ones.

**Source attribution (Observed):** All persisted relationships include a `source: 'static'` marker, while merging preserves existing edges marked `'ai'` or `undefined`. This appears to enable distinguishing automatically-discovered relationships from manually-curated ones, supporting a workflow where humans and tools contribute non-conflicting relationship types.

**Stale edge cleanup (Observed):** The code explicitly removes old static edges from blocks that no longer produce edges in Pass 3. For file-level edges in "Pass 2b," the logic handles creation and update in a unified loop rather than separating them. This asymmetry suggests block-level cleanup was a later refinement or that file-level logic evolved differently.

**Registry validation (Observed):** Edges targeting non-existent blocks are skipped and counted separately (`relationshipsSkipped`), suggesting the registry acts as a whitelist and missing targets are expected anomalies, not errors.

**Plugin-driven scanning (Observed):** Language-specific plugins are resolved by filename (`getScannerPlugin(relPath)`), allowing extensibility for different file types without modifying core logic.

## What Cannot Be Determined

**[Business context]:** What "relationships" represent in the application domain (dependencies, test coverage, architecture boundaries, documentation links, etc.). The code is agnostic to relationship semantics.

**[User intent on stale cleanup]:** Why block-level static edges are automatically removed when no new edges are found (Pass 3), but the file-level cleanup is implicit within a single conditional. It's unclear if this is intentional asymmetry or technical debt. The comment "Clear stale static edges..." suggests deliberation, but the rationale for *when* to clear is not explicit.

**[Performance expectations]:** No batching, transaction grouping, or async concurrency control is visible. Whether `O(files × blocks)` behavior in the stale cleanup phase is acceptable depends on repository scale.

**[Plugin contract]:** What guarantees `getScannerPlugin().scan()` provides about edge validity, whether it can return duplicates, or how it handles parse failures. The code silently continues if no plugin matches.

**[Registry construction cost]:** Whether `buildBlockRegistry(repoRoot, allFiles)` is expensive and why it must precede scanning rather than being built incrementally.

**[Annotation file format stability]:** Whether `parseAnnotation<BlockFrontmatter>` and `parseAnnotation<FileFrontmatter>` can fail, how they handle malformed input, and what guarantees exist about frontmatter structure post-parse.

**[Concurrency and race conditions]:** Whether concurrent scans or external writes to annotation files during this function are possible, and whether the read-modify-write pattern for annotation files has consistency guarantees.
