---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-core.test.ts::describe(buildIndex propagates pipeline field)
file: tests/unit/scanner-core.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.586Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/scanner-core.test.ts::describe(buildIndex propagates pipeline field)
  line_range:
    start: 34
    end: 75
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f9e33eae143cc10cd03b7f95cc493e613c51675b6fc0dada3fa727eb2a92ab56
  structural:
    kind: describe
    parent_scope: module
    name: describe(buildIndex propagates pipeline field)
    index_in_parent: 1
  semantic_fingerprint: >-
    Tests that the `buildIndex` function correctly propagates source pipeline information from block relationship
    metadata into both the block's outgoing relationships and the global relationships index.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(buildIndex propagates pipeline field)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This test verifies that when `buildIndex` processes block annotations containing relationships with a `source` field (referred to as "pipeline"), that pipeline metadata is correctly preserved and propagated to two locations: (1) the `relationships_out` array on individual blocks, and (2) the global `relationships` collection in the index. The test validates data integrity through the indexing pipeline by checking that both "static" and "ai" source values are preserved for their respective dependencies.

## Inferred Design Rationale

**Relationship source tracking:** The code observes that relationships have a `source` field (values: 'static', 'ai') which represents the origin or method of relationship discovery. This is likely preserved to maintain provenance and enable filtering or prioritization of relationships based on detection method. *(Observing)*

**Dual relationship storage:** The design appears to store relationships in two forms—both attached to individual blocks (`relationships_out`) and in a flattened global index (`relationships`). This likely enables both block-centric and graph-centric query patterns. *(Inferring)*

**Pipeline field naming:** The `source` field from frontmatter is renamed to `pipeline` in the index structures, suggesting an intentional semantic distinction between "how was this relationship identified" (source) and "which processing pipeline should handle it" (pipeline). *(Inferring)*

**Test setup complexity:** The elaborate frontmatter object with identity, structural metadata, and timestamp fields suggests a mature annotation system where relationships are embedded within versioned, content-addressed blocks. *(Observing)*

## What Cannot Be Determined

**[Business context]:** Why distinguishing between 'static' and 'ai' sourced relationships matters—whether this drives different analysis, presentation, or verification workflows.

**[Indexing implementation details]:** How `buildIndex` actually performs the propagation; whether it transforms, copies, or references the relationship objects; whether pipeline assignment happens during parsing, normalization, or a separate pass.

**[Relationship semantics]:** What 'depends_on' relationships represent in this codebase, or whether other relationship types exist and handle pipeline differently.

**[Edge cases]:** Whether relationships without a `source` field are handled; what happens if relationships_out and relationships become out of sync; whether there are integrity constraints enforced.

**[Historical alternatives]:** Whether the pipeline field was always renamed from source, or if there was consideration for keeping source and adding pipeline separately.
