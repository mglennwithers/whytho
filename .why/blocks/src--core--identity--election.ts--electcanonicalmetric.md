---
whytho: "1.0"
type: block
symbolic_ref: src/core/identity/election.ts::electCanonicalMetric
file: src/core/identity/election.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/identity/election.ts::electCanonicalMetric
  line_range:
    start: 46
    end: 186
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:e59528423e57d697def301ecc39cfb9b68122b627f8a738c812387a7869d045a
  structural:
    kind: function
    parent_scope: module
    name: electCanonicalMetric
    parameters: (2 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    A multi-strategy election algorithm that resolves code block identity through cascading fallback rules—from
    symbolic+structural agreement (highest confidence) through structural-only matching, to AI-assisted semantic
    fingerprinting (lowest confidence)—ultimately returning either a matched block with updated identity metadata or an
    unresolvable/deleted outcome.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# electCanonicalMetric

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This function implements a **canonical metric election system** for tracking code block identity across commits despite refactoring, relocation, and modification. It accepts a previously-stored block identity along with current candidate blocks and attempts to determine which candidate represents the same logical entity, returning both the matched block and updated identity metadata (symbolic reference, hash, structural info, and confidence score).

The cascading rule structure suggests this exists to handle real-world code evolution: developers rename functions, move blocks between files, refactor implementations, and delete code. The function must robustly re-identify the "same" block across these transformations.

## Inferred Design Rationale

- **Cascading confidence hierarchy (Rules 1→5):** [Observed] The rules are explicitly ordered by confidence (0.95 → 0.90 → 0.75 → 0.8×result → 0.0), suggesting that stricter matching criteria (symbolic+structural agreement) are more reliable than looser ones (semantic fingerprinting alone). This likely reflects a philosophy that exact structural/symbolic matches are more trustworthy than probabilistic AI matching.

- **Multiple identity metrics:** [Observed] The code maintains four parallel identity metrics (symbolic, content_hash, structural, semantic_fingerprint). This appears intentional—no single metric is reliable alone because: symbolic references break when code moves; content hashes break on refactoring; structural patterns are ambiguous in large files; semantic fingerprints require AI and timeout risk. The design seems to treat these as complementary fallbacks.

- **AI as last resort with timeout protection:** [Observed] The semantic fingerprint rule wraps the AI call in `Promise.race()` with a `DEFAULT_SEMANTIC_TIMEOUT_MS` timeout and returns `null` on timeout. This likely indicates: (a) AI matching is expensive/slow, (b) unresponsive AI should not block the pipeline, (c) the confidence is discounted by 0.8× to reflect lower reliability. The try-catch that silently falls through suggests AI failures are expected and acceptable.

- **Structural matching appears as validation step:** [Observed] Rules 1 and 2 both require `structuralMatch()` in addition to their primary metric. This suggests structural matching is viewed as a **validation gate**—a content hash match alone isn't enough; the structure must also align to avoid false positives.

- **Outcome taxonomy:** [Observed] The function returns three outcome states: `RESOLVED` (match found), `RELOCATED` (symbolic broken but recoverable via hash), `DELETED` (no candidates), and `UNRESOLVABLE` (candidates exist but none matched). This suggests the pipeline distinguishes between "lost blocks" (deletion) and "broken identities" (relocation/refactoring), likely for different downstream handling.

- **Confidence scoring discipline:** [Observed] Each rule assigns a fixed confidence value in the return, suggesting these are calibrated thresholds rather than dynamic. The comment "Slight discount for AI matching" (0.8×) indicates awareness that the same underlying confidence from AI should be treated as less reliable when used as the sole matching criterion.

## What Cannot Be Determined

- **[Business context]:** What system uses this (version control system, code analysis tool, IDE feature)? Are users expected to review/override elections, or is this fully automated?

- **[Structural match definition]:** The `structuralMatch()` function is not shown. Does it check only block kind and parent scope, or does it also validate parameter counts, return types, or other signatures? This significantly affects false positive rates.

- **[Semantic fingerprint composition]:** What constitutes `stored.semantic_fingerprint`? Is it an embedding, a syntax tree hash, or something else? This affects whether Rule 4 is truly "semantic" or just a more flexible structural match.

- **[Constants and thresholds]:** The values `DEFAULT_SEMANTIC_TIMEOUT_MS`, `SEMANTIC_MATCH_MIN_CONFIDENCE`, and the 0.8× discount factor are undefined. What are their actual values? Are they tuned empirically?

- **[Performance/scalability considerations]:** Does the O(n) scan in Rule 2 and Rule 3 cause issues with large files (hundreds of blocks)? Was the hash precomputation added for performance, or is it defensive?

- **[Historical evolution]:** Why does this function exist at all—was there a prior simpler version that failed? Which rules were added first, and which are most frequently used in production?

- **[Symbolic reference format stability]:** The new symbolic reference is constructed as `${filePath}::${blockName}`. Is this format stable across the system? Can block names change without breaking the identity (e.g., method overloading, same name in nested scopes)?

- **[Rule 2 outcome ambiguity]:** The outcome is `symbolicBlock ? 'RESOLVED' : 'RELOCATED'`. This suggests different semantics, but both return confidence 0.90. Why is relocation considered different from resolution? Is this for metrics/logging?
