---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/clean.ts::registerClean
file: src/cli/commands/clean.ts
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
  symbolic: src/cli/commands/clean.ts::registerClean
  line_range:
    start: 59
    end: 137
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:b8162d5ac47b9557198c243d13117ce5fda722506b7af4ded50da541cf7d9368
  structural:
    kind: function
    parent_scope: module
    name: registerClean
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Registers a CLI command that identifies and removes orphaned annotation files whose referenced source files,
    folders, or code blocks no longer exist in the repository, with support for dry-run preview and JSON output.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# registerClean

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function registers a `clean` subcommand for a git-based annotation system (likely called "git why"). The command detects "orphaned" annotations—documentation or metadata files stored in a `.why/` directory that reference files, folders, or code blocks that have been deleted from the repository. It provides safety features (dry-run mode) and flexible output formats (human-readable or JSON), then removes the orphaned annotations if not in dry-run mode.

## Inferred Design Rationale

**Orphan Detection via Parallel Scanning** (observed): The code uses `Promise.all()` to simultaneously scan three annotation types (blocks, files, folders) rather than sequentially. This suggests the orphan-finding operation is I/O-intensive enough to justify parallelization, and the three categories are independent.

**Frontmatter-Based Reference Extraction** (observed): Each `findOrphans()` call passes a selector function that extracts the referenced path from annotation frontmatter (e.g., `(fm) => (fm as Partial<BlockFrontmatter>).file`). This reveals that annotations are markdown-like files with frontmatter metadata pointing to their source subjects.

**Dual Output Modes** (observed): The command branches into JSON or human-readable output. This likely supports both automated tooling (CI/CD pipelines) and interactive developers, suggesting the tool integrates into larger workflows.

**Dry-Run Safety Pattern** (observed): The `--dry-run` flag prevents actual deletion and changes messaging from "removing" to "would remove". This is a common safety pattern for destructive operations, suggesting prior UX consideration.

**Silent Failure on Deletion** (observed): `.catch(() => {})` suppresses errors during `fs.unlink()`, likely to handle race conditions or permission issues gracefully without stopping the entire clean operation.

**Post-Clean Guidance** (observed): The output suggests running `git why resolve --full` after cleanup, implying a multi-step workflow where annotations trigger index rebuilds.

## What Cannot Be Determined

**[Orphan Detection Algorithm]:** The actual logic in `findOrphans()` is not visible. It's unclear whether it does filesystem existence checks, git status checks, AST parsing for block references, or some combination. The `isDirectory` parameter (true for folders, false for others) hints at different strategies, but specifics are hidden.

**[Performance Characteristics]:** No information about typical repository size, annotation volume, or acceptable runtime. The parallelization suggests performance matters, but we cannot infer scale requirements.

**[Why Three Separate Functions]:** Whether `blocksDir()`, `filesDir()`, and `foldersDir()` point to different storage structures is unknown. This could reflect different annotation schemas or simply organizational choice.

**[Historical Context]:** Why annotations exist at all, what problem they solve, or whether this is an internal tool versus published product is unknown.

**[Error Recovery Strategy]:** The `.catch(() => {})` during deletion silently ignores errors. Whether this is intentional graceful degradation or masks genuine problems cannot be determined.

**[Why Folders Get `isDirectory: true`]:** The parameter's purpose and how it affects orphan detection logic is not visible in this block.
