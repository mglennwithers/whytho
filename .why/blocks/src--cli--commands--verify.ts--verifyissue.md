---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/verify.ts::VerifyIssue
file: src/cli/commands/verify.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/verify.ts::VerifyIssue
  line_range:
    start: 22
    end: 26
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:85d3ec852737ea5422e18f4caabb6d8f154e4c6d2eba447c49a218e1787972c2
  structural:
    kind: interface
    parent_scope: module
    name: VerifyIssue
    index_in_parent: 1
  semantic_fingerprint: >-
    A TypeScript interface defining the structure of verification issues found during CLI validation, containing file
    location, issue category, and descriptive message.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# VerifyIssue

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This interface defines the data structure for reporting issues discovered during a verification process in a CLI tool. The `VerifyIssue` represents a single problem found when validating files, allowing the verify command to collect and communicate multiple issues back to the user in a structured format. It likely serves as the return type or collection element for a verification operation.

## Inferred Design Rationale

- **Three-field structure:** Observing that the interface contains exactly three properties suggests a minimal, focused design. The inclusion of `file` indicates issues are tied to specific files, enabling users to locate problems.

- **Literal union type for `type`:** The `type` field uses a literal union (`'schema' | 'orphan' | 'parse'`) rather than a string, which likely enforces type safety and enables downstream code to handle specific issue categories differently. This pattern suggests the developers anticipated distinct handling logic for different verification failures.

- **Human-readable `message`:** The presence of a `message` field (rather than error codes alone) likely indicates the tool prioritizes user experience, providing clear explanations of what went wrong.

- **Absence of severity/line numbers:** The lack of properties like `severity`, `line`, or `column` suggests either (a) this tool operates at file-level granularity, or (b) those details are provided elsewhere in the codebase.

## What Cannot Be Determined

- **[Business Context]:** What domain these verification types (`schema`, `orphan`, `parse`) represent—whether this is for configuration validation, documentation consistency, data integrity, or something else.

- **[Issue Frequency & Handling]:** Whether multiple issues per file are expected, how they're aggregated, or whether verification stops at the first issue or continues to collect all problems.

- **[Error Severity]:** Whether all issues are equally critical or if there's an implicit severity hierarchy implied by the three type categories.

- **[Downstream Processing]:** How this interface is consumed—whether issues are logged, written to files, displayed in a report, or used to determine exit codes.

- **[Alternative Designs Considered]:** Why this flat structure was chosen over nested objects, error objects, or other representations.
