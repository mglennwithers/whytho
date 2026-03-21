---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/election.test.ts::describe(electCanonicalMetric)
file: tests/unit/election.test.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/election.test.ts::describe(electCanonicalMetric)
  line_range:
    start: 41
    end: 119
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:c6a92c0f17b8b24fa1f1e1e952609ec4dc3431c8da4ea335b97745fa55fbbd3f
  structural:
    kind: describe
    parent_scope: module
    name: describe(electCanonicalMetric)
    index_in_parent: 0
  semantic_fingerprint: >-
    Unit tests for an `electCanonicalMetric` function that resolves code block identities across commits by comparing
    symbolic (name-based) and structural (AST-based) metrics, with rules for handling matches, updates, deletions, and
    unresolvable cases.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# describe(electCanonicalMetric)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This test block validates the core logic of a code block identity resolution system. The `electCanonicalMetric` function appears to be the decision engine that determines whether a stored code block identity (from a previous commit) can be matched to candidate blocks in new source code, and if so, which matching metric (symbolic vs. structural) should be considered canonical. The tests cover the happy path (Rule 1: agreement), content mutation handling, and failure cases (Rules 5: deletion/unresolvable).

## Inferred Design Rationale

- **Dual metric system (symbolic + structural):** The function compares name-based identity with AST structure-based identity. When both agree, symbolic is elected canonical (observed in Rule 1 tests). This is likely designed to handle refactoring robustness—symbolic matching catches renames while structural matching catches moved code.

- **Content hash tracking with structural/symbolic identity preservation:** Test "Rule 1 still fires when content changes" shows the system distinguishes between identity (name/structure) and implementation (content hash). This likely supports scenarios where function logic changes but the identity should remain stable, allowing dependency tracking across minor edits.

- **Graduated failure modes (DELETED vs. UNRESOLVABLE):** Two distinct negative outcomes—DELETED when no candidates exist, UNRESOLVABLE when candidates exist but don't match. This appears intentional to distinguish "block is gone" from "we're confused about which block it is," likely for different downstream handling (cleanup vs. manual review).

- **Confidence score alongside outcome:** The presence of `confidence > 0.8` expectation (observed) suggests probabilistic matching rather than binary logic, likely needed because symbolic/structural heuristics can have false positives.

- **updatedIdentity field:** When a match occurs with content changes, the result includes an updated identity. This likely enables incremental updates to a tracking database without re-parsing the entire codebase.

## What Cannot Be Determined

- **[Rule definitions]:** What Rules 2, 3, 4 are and how they interact with Rule 1 and Rule 5. Only partial rule coverage is tested here.

- **[Matching algorithm]:** How symbolic and structural metrics actually resolve candidates (e.g., fuzzy name matching vs. exact, how structural similarity is computed). The tests use mock builders (`makeIdentity()`, `makeBlock()`) that obscure the real logic.

- **[Business context]:** Why this system exists—whether it's for code coverage tracking, refactoring detection, dependency analysis, or something else. The identity/canonical framing suggests program analysis tooling, but use case is opaque.

- **[Performance/scale requirements]:** Whether this function is designed for single-file analysis or whole-repository reconciliation, and whether performance is a concern.

- **[Integration with upstream/downstream systems]:** How outcomes feed into other systems, what happens with UNRESOLVABLE results in production, how updatedIdentity is persisted.

- **[Content hash algorithm]:** What `computeContentHash()` does and why it's the right choice for identity mutation detection vs. alternatives (AST hash, line-based diff, etc.).
