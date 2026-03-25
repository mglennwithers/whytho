---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/scan.ts::filesToScan
file: src/cli/commands/scan.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:30.389Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/scan.ts::filesToScan
  line_range:
    start: 74
    end: 74
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:b4c2f3bf399aaf1234da0cb47a9d66b30a7cb1853778f5ab526c6424fa0861b4
  structural:
    kind: const
    parent_scope: module
    name: filesToScan
    index_in_parent: 11
  semantic_fingerprint: >-
    Conditionally selects either a single user-specified file or all available files for scanning based on command-line
    options.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# filesToScan

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This line determines which files should be scanned by checking whether the user provided a specific file via command-line options. If `options.file` is provided, it wraps that single file in an array; otherwise, it defaults to scanning all files available in the `allFiles` collection. This pattern allows the scan command to support both targeted (single-file) and comprehensive (all-files) scanning modes.

## Inferred Design Rationale

- **Ternary operator for mode selection** (observed): The code uses a conditional to switch between two execution paths, indicating this is a deliberate feature toggle rather than a bug or oversight.

- **Array normalization** (observed): Both branches return an array type (`[options.file]` vs `allFiles`), suggesting the downstream code expects a consistently typed collection to iterate over.

- **User-specified file takes precedence** (inferred): The structure suggests that when a user explicitly provides a file, it overrides the default behavior of scanning everything—likely a UX design choice to allow quick targeted scans without processing unnecessary files.

- **Assumes `allFiles` is pre-computed** (inferred): The code references `allFiles` as an existing variable, suggesting an earlier step discovers or filters available files before this decision point.

## What Cannot Be Determined

- **[Source of allFiles]:** Where `allFiles` is populated—whether it comes from filesystem discovery, a configuration file, or filtered results is unknown.

- **[Type of options.file]:** Whether `options.file` accepts a single string or could be an array/glob pattern is not visible here.

- **[Performance implications]:** Whether scanning all files could cause performance issues that justify the single-file override exists only as speculation.

- **[Downstream processing]:** What operations are performed on `filesToScan` and whether the array wrapper is essential or just a convenience.

- **[Business requirements]:** Why both modes are needed—whether this addresses user requests, operational workflows, or CI/CD constraints is unknown.
