---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/verify.ts::registerVerify
file: src/cli/commands/verify.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/verify.ts::registerVerify
  line_range:
    start: 95
    end: 184
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:25f58bcd051b7ca57c6647272a251a648df820b26cc8a777d5ae36e1de073e74
  structural:
    kind: function
    parent_scope: module
    name: registerVerify
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Registers a CLI command that validates annotation metadata schemas across blocks, files, folders, and sessions while
    optionally detecting orphaned annotations, with output in human-readable or JSON format.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# registerVerify

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function registers a `verify` subcommand for a git-based annotation system (`.why/`). The command validates that all annotation frontmatter conforms to defined schemas and optionally detects "orphaned" annotations (likely those referencing deleted source code). It provides flexible output options and directs users toward remediation steps when issues are found.

## Inferred Design Rationale

**Initialization check before operations** — The code verifies `.why/` directory initialization before proceeding. This is a defensive pattern, likely because the annotation system requires setup and operating on an uninitialized directory would be meaningless or dangerous. (Observing)

**Parallel verification across four annotation types** — `Promise.all()` is used to verify blocks, files, folders, and sessions concurrently. This suggests these checks are independent and performance matters, probably because repositories with many annotations could be slow if run sequentially. (Inferring)

**Sessions treated differently from other annotations** — Sessions skip orphan detection (`false` parameter) with an inline comment: "sessions are permanent records." This suggests a deliberate design decision that sessions represent immutable history while other annotations can be deleted. (Observing)

**Three-tier issue categorization** — Issues are segregated into schema violations, orphan issues, and parse errors with distinct visual treatment (red ✗, yellow !, red ✗). This taxonomy likely reflects user workflow: parse errors must be fixed first, schema violations indicate data integrity problems, and orphans suggest cleanup opportunities. (Inferring)

**Dual output modes** — The `--json` flag enables programmatic consumption while default human-readable output uses colors and relative paths. This pattern suggests the tool is designed for both CLI users and potential integration into larger systems/CI pipelines. (Observing)

**Exit code differentiation** — The command exits with code 1 when issues exist but succeeds silently otherwise. This integrates the command into standard Unix pipelines and CI/CD practices. (Observing)

## What Cannot Be Determined

**[Business context]:** Why orphan detection exists as a concept — is this addressing a specific pain point from annotation management, or a general best practice? What makes an annotation "orphaned" at the code level?

**[Performance characteristics]:** Whether parallelizing the four verification operations provides meaningful speedup, or if one operation dominates execution time. The `verifyDir` implementation isn't visible.

**[Schema semantics]:** What the four frontmatter schemas (Block, File, Folder, Session) actually validate. The schemas are imported but their constraints are unknown.

**[Historical alternatives]:** Why `--no-orphans` uses negation logic rather than `--orphans` (default true vs. default false). This could reflect user research or incremental feature addition.

**[Error recovery expectations]:** Whether users are expected to manually fix parse errors in YAML/frontmatter, or if a separate command exists to auto-repair them.

**[Integration context]:** What "git why" is in the broader ecosystem — is this a custom internal tool or published open-source? How does it relate to standard Git workflows?
