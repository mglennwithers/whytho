---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/session.ts::registerSession
file: src/cli/commands/session.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:00.128Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/session.ts::registerSession
  line_range:
    start: 9
    end: 62
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:567d2541b4cdad8174a2d61452fe7742673161471a00d2c6bd25fe461ad392e3
  structural:
    kind: function
    parent_scope: module
    name: registerSession
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that displays detailed information about a single session or lists all available sessions,
    with optional JSON output formatting.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAllSessions
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::sessionAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: ai
  - type: depends_on
    target: src/core/types.ts::SessionFrontmatter
    source: ai
---

# registerSession

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function registers a `session` subcommand for a CLI program that allows users to either view detailed information about a specific session (by ID) or list all available sessions. When displaying a session, it shows metadata including the model used, creation date, user, affected files, and associated commits, along with an annotation body. The command supports JSON output for programmatic consumption.

## Inferred Design Rationale

**Repository-scoped storage:** The code retrieves sessions from a `whyRoot` directory structure derived from the repository root, suggesting sessions are repository-specific artifacts rather than globally stored. *(Observed: `findRepoRoot()`, `getWhyRoot()` calls)*

**Dual-mode operation (list vs. detail):** The presence of an optional `id` parameter determines whether to list all sessions (no ID) or show details for one session (with ID). This follows common CLI patterns for reducing command proliferation. *(Observed: conditional on `if (!id)`)*

**Sorted chronological display:** Sessions are sorted by creation date in descending order when listing, likely prioritizing recent sessions for user convenience. *(Observed: `sort((a, b) => b.frontmatter.created.localeCompare(a.frontmatter.created))`)*

**Graceful error handling for missing sessions:** The code explicitly checks file existence and exits with an error code rather than throwing, suggesting intentional user-facing error reporting. *(Observed: `fileExists()` check followed by `process.exit(1)`)*

**Flexible frontmatter structure:** The use of generic `readAnnotationFile<SessionFrontmatter>` suggests the annotation file format is reusable, with session-specific metadata separated from body content. *(Observed: generic type parameter)*

**Optional metadata fields:** Conditional rendering of `user` and `model_provider` suggests these fields may not always be present in sessions. *(Observed: `if (fm.user)` and ternary for `model_provider`)*

## What Cannot Be Determined

**[Business context]:** What a "session" represents in this system—whether it's an AI coding session, a development session, or something else entirely.

**[File format]:** The exact structure and serialization format of annotation files (appears to be YAML or Markdown frontmatter, but not confirmed from code alone).

**[SessionFrontmatter schema]:** Complete definition of all frontmatter fields and whether there are additional optional fields beyond those rendered.

**[Performance implications]:** Whether `readAllSessions()` loads sessions into memory versus streaming them, and how performance scales with large numbers of sessions.

**[Access control]:** Whether there are permission checks before displaying sessions or if all sessions are visible to all users.

**[Why `localeCompare` was chosen]:** Whether chronological sorting using string comparison is intentional or if a date-aware sort was avoided for a specific reason.

**[Historical context]:** Whether the JSON output option was added later as a feature request, or if it was designed for this purpose from the start.
