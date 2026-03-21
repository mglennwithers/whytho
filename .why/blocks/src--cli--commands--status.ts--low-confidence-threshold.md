---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::LOW_CONFIDENCE_THRESHOLD
file: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-21T21:20:00.358Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.62
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::LOW_CONFIDENCE_THRESHOLD
  line_range:
    start: 14
    end: 14
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:6aa39653eb4a0f96b063f54ff9cc2d0410aa457864ba08959eb8a51aefb318b6
  structural:
    kind: const
    parent_scope: module
    name: LOW_CONFIDENCE_THRESHOLD
    index_in_parent: 0
  semantic_fingerprint: >-
    Defines a numeric threshold constant (0.7) used to classify confidence levels as "low" in a CLI status command,
    likely for filtering or categorizing results based on confidence scores.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# LOW_CONFIDENCE_THRESHOLD

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **62%**

## Purpose

This constant establishes a boundary value for determining whether a confidence metric should be considered "low" in the context of a status command. Any confidence score at or below 0.7 (70%) is classified as low confidence. The constant likely serves as a classification threshold for displaying warnings, filtering output, or highlighting uncertain results to the user.

## Inferred Design Rationale

- **Threshold value of 0.7:** This appears to be a deliberately chosen cutoff rather than an extreme value (0.5 or 0.9), suggesting a moderately conservative standard. The developer likely selected this to balance between catching genuinely uncertain results and avoiding excessive false positives. (inferring)

- **Named constant rather than magic number:** The use of a named constant rather than hardcoding `0.7` indicates the value may need to be referenced in multiple locations or adjusted in the future without code changes. (observing)

- **Placement in status.ts:** This threshold exists in a CLI status command, suggesting the code displays operational status information where confidence levels matter to users. (inferring)

- **Specific naming "LOW_CONFIDENCE":** The explicit naming convention makes the semantic meaning clear and searchable, suggesting this is one of potentially multiple thresholds. (observing)

## What Cannot Be Determined

- **[Business Context]:** Why 0.7 specifically was chosen—whether this derives from domain standards, empirical testing, or arbitrary convention is unknown.

- **[Usage Pattern]:** Whether this threshold is used for filtering output, colorizing display, triggering warnings, or computing statistics cannot be determined from this constant definition alone.

- **[Related Thresholds]:** Whether other confidence thresholds (MEDIUM_CONFIDENCE, HIGH_CONFIDENCE) exist elsewhere in the codebase and how they relate to this value.

- **[Source of Confidence Scores]:** What mechanism generates the confidence values being compared against this threshold.

- **[Performance Impact]:** Whether this threshold has any performance implications or if it's purely a display/categorization concern.
