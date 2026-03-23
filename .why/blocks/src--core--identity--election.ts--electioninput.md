---
whytho: "1.0"
type: block
symbolic_ref: src/core/identity/election.ts::ElectionInput
file: src/core/identity/election.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:01.592Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/identity/election.ts::ElectionInput
  line_range:
    start: 7
    end: 13
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:09c30085b0bf2c9159f6051c37ed4b9fa515229bf365199bf9beb5d49a224b4c
  structural:
    kind: interface
    parent_scope: module
    name: ElectionInput
    index_in_parent: 0
  semantic_fingerprint: >-
    A data structure that bundles a stored block identity with candidate alternatives, file metadata, and commit
    information for the purpose of selecting or reconciling block identities across versions.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/core/types.ts::BlockIdentity
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
---

# ElectionInput

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This interface defines the input contract for an election process that likely determines which identity should be assigned to a code block. The interface aggregates a reference identity (`stored`), alternative candidates (`candidates`), and contextual metadata (`filePath`, `commitSha`, `source`) needed to make an informed selection decision. This appears to support a system that tracks or reconciles block identities across git commits and file changes.

## Inferred Design Rationale

- **Separation of reference vs. candidates:** The distinction between `stored` (singular, prior identity) and `candidates` (plural, alternatives) suggests a voting or comparison mechanism where the stored identity serves as a baseline against which new candidates are evaluated. (Inferred from naming and structure)

- **Git metadata inclusion:** The presence of `commitSha` and `filePath` indicates this system operates within a version-control context, likely needing to track identity changes across commits. (Observed from field names)

- **ParsedBlock array type:** Candidates are stored as parsed blocks rather than raw data, suggesting blocks have been pre-processed into a normalized representation before entering the election logic. (Inferred from naming convention)

- **Generic source field:** The `source` string field appears to be a flexible metadata field, suggesting the election process may need to handle identities from multiple sources or input channels. (Inferred from vagueness of the field name)

## What Cannot Be Determined

- **[Election algorithm]:** The actual logic for selecting among candidates is not present; whether this uses voting, fuzzy matching, heuristics, or deterministic rules is unknown.

- **[Business domain]:** Whether "identity" refers to function names, code blocks, AST nodes, or some other semantic unit is unclear without broader codebase context.

- **[Performance expectations]:** Whether this interface is used for single-block operations or batch processing of thousands of blocks.

- **[Failure modes]:** What happens when no consensus is reached or when stored identity doesn't match any candidates.

- **[Mutation semantics]:** Whether this is a pure input structure or whether the election process modifies the input objects.
