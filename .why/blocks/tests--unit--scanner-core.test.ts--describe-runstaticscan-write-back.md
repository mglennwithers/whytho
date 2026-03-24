---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-core.test.ts::describe(runStaticScan write-back)
file: tests/unit/scanner-core.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/scanner-core.test.ts::describe(runStaticScan write-back)
  line_range:
    start: 92
    end: 244
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:e0df8ffb97a85eebf349aaa1bb781075acd127234fb7d7b6cf161e697ec0f81f
  structural:
    kind: describe
    parent_scope: module
    name: describe(runStaticScan write-back)
    index_in_parent: 3
  semantic_fingerprint: >-
    Test suite validating that `runStaticScan` correctly updates code block and file annotations by replacing stale
    static relationships while preserving AI-generated edges, and properly routes relationships to the correct
    annotation type.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# describe(runStaticScan write-back)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This test block validates the write-back behavior of a static code scanner that analyzes source files to detect code relationships (dependencies, references, etc.). The tests ensure that when `runStaticScan` processes files, it:

1. **Updates existing annotations** by replacing stale static-source relationships with freshly scanned ones
2. **Preserves non-static relationships** (particularly AI-generated edges that shouldn't be overwritten by automated scanning)
3. **Routes relationships correctly** between file-level and block-level annotations depending on the edge type
4. **Returns accurate metadata** about what was scanned and written

The suite appears designed to prevent data loss and maintain the integrity of mixed human/AI/static relationship metadata.

## Inferred Design Rationale

**Relationship source tracking** (observed): Relationships carry a `source` field ('static', 'ai') to distinguish their origin. This allows the scanner to selectively update only static edges without clobbering AI-annotated relationships. This design likely emerged from a need to support incremental, non-destructive updates where different annotation sources coexist.

**Separate file vs. block annotations** (observed): The code distinguishes between `fileAnnotationPath` and `blockAnnotationPath`, with logic routing file-level edges to file annotations. This suggests a hierarchical metadata model where scope matters. Likely rationale: finer-grained (block-level) relationships require block annotations, while coarser (file-level) relationships belong at file scope.

**Registry-based target validation** (observed): The test plugin checks `registry.has(target)` before emitting edges. This likely prevents orphaned relationships pointing to non-existent targets and ensures referential integrity.

**Rescan idempotence** (observed): Tests verify that re-scanning a file with no new edges still clears stale static edges. This suggests the design intentionally treats "no relationships found" as signal to purge old static data, not as "no change needed."

**Helper `makeBlockFm` factory** (observed): Standardizes block frontmatter structure with required fields (identity, structural info, timestamps). Likely exists to reduce test boilerplate and ensure frontmatter schema compliance.

## What Cannot Be Determined

**[Business context]:** Why this codebase needs mixed static/AI relationship tracking. Is this a code intelligence tool, documentation generator, or dependency mapper? The "whytho" field suggests introspection/traceability, but the purpose isn't clear.

**[Relationship semantics]:** What 'depends_on' means in this system—is it a call dependency, data dependency, or something domain-specific? How other relationship types ('type' field) are used or validated.

**[Performance expectations]:** Whether scanning should be fast/lazy or thorough, whether there are batching/parallelization requirements, or acceptable limits on relationship count.

**[Plugin ecosystem]:** How `RelationshipScanner` plugins are discovered, loaded, or versioned in production. The tests use manual `registerScannerPlugin` registration; real deployment likely has different plugin management.

**[Registry implementation]:** What the registry object contains, how it's populated, or whether it contains all symbols in a file or only analyzed ones.

**[Annotation serialization format]:** The internal structure of `serializeAnnotation` output; tests only verify presence/absence of string fragments, not structural correctness.

**[Historical constraints]:** Why file-level edges are routed differently than block-level edges—whether this is an architectural necessity or an arbitrary convention that could be unified.

**[Error handling]:** How the function behaves on permission errors, malformed annotations, or missing target blocks—all tests use happy paths.
