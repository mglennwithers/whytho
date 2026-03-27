# Whytho Specification

**Version:** 1.0.0
**Status:** Released
**Date:** 2026-03-19

---

## Table of Contents

1. [Overview](#1-overview)
2. [Conventions](#2-conventions)
3. [Folder Structure](#3-folder-structure)
4. [File Formats](#4-file-formats)
5. [Session Annotations](#5-session-annotations)
6. [Folder Annotations](#6-folder-annotations)
7. [File Annotations](#7-file-annotations)
8. [Block Annotations](#8-block-annotations)
9. [Block Identity](#9-block-identity)
10. [Commit-Time Resolution](#10-commit-time-resolution)
11. [Cross-Linking](#11-cross-linking)
12. [Relationship Annotations](#12-relationship-annotations)
13. [Hook Event Contract](#13-hook-event-contract)
14. [Index Schema](#14-index-schema)
15. [Archive Index Schema](#15-archive-index-schema)
16. [Archival](#16-archival)
17. [Versioning](#17-versioning)
18. [Guidance for Implementers](#18-guidance-for-implementers)

---

## 1. Overview

Whytho is an open standard for persisting AI reasoning, decisions, and code understanding alongside a git repository. The standard defines a `.why/` folder structure, four levels of structured annotations, a block identity system using multiple simultaneous metrics, a commit-time resolution protocol, a relationship graph with hook events, and an archival system that preserves reasoning permanently.

The standard is format-oriented. It defines file structures, schemas, resolution outcomes, and event contracts. It does not mandate any specific AI model, editor integration, CI pipeline, or implementation language.

### 1.1 Goals

- Make AI reasoning a permanent, versioned artifact of the repository.
- Guarantee annotation freshness through commit-time resolution, not human discipline.
- Maintain block-to-annotation linkage across renames, refactors, moves, splits, merges, and rewrites.
- Provide a navigable relationship graph for both humans and AI agents.
- Preserve reasoning for deleted and superseded code through archival.
- Distinguish decisions made by humans from decisions made by AI.

### 1.2 Scope

This specification covers the `.why/` folder structure and all files within it. It does not cover the `git why` command-line interface, editor integrations, CI/CD integrations, or AI model behavior beyond the annotation schemas they must produce. Those are implementation concerns governed by their own documentation.

---

## 2. Conventions

### 2.1 Terminology

**MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are used as defined in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

**Annotation** — a Markdown file with YAML frontmatter that describes a session, folder, file, or block.

**Block** — a discrete unit of code with a distinct purpose. Typically a function, method, class, type definition, or configuration block. The granularity is determined by the annotating agent.

**Resolver** — the AI or algorithmic component that runs at commit time to update block identity metrics and determine resolution outcomes.

**Canonical metric** — the identity metric currently considered most reliable for a given block annotation, as elected by the resolver.

**Session** — a single continuous interaction between a human and an AI coding assistant that produces one or more commits.

### 2.2 Identifiers

All annotation files are identified by a slug derived from their subject:

- Session annotations: `{date}-{slug}.md` (e.g., `2025-06-14-auth-refactor.md`)
- Folder annotations: mirror source path with `/` replaced by `--` (e.g., `src--auth.md` for `src/auth/`)
- File annotations: mirror source path with `/` replaced by `--` and extension replaced (e.g., `src--auth--middleware.ts.md`)
- Block annotations: mirror source path plus block name (e.g., `src--auth--middleware.ts--rotateTokenIfNeeded.md`)

Implementations MUST use `--` as the path separator in annotation filenames. The original path MUST be recoverable from the filename by reversing this substitution.

### 2.3 Timestamps

All timestamps MUST be ISO 8601 format with timezone offset or UTC designator (e.g., `2025-06-14T09:32:00Z`).

---

## 3. Folder Structure

A compliant `.why/` folder MUST have the following structure:

```
.why/
  sessions/
  folders/
  files/
  blocks/
  archive/
    sessions/
    folders/
    files/
    blocks/
  index.json
  archive-index.json
```

### 3.1 Directory Descriptions

`sessions/` — contains one Markdown file per AI coding session.

`folders/` — contains one Markdown file per annotated source folder.

`files/` — contains one Markdown file per annotated source file.

`blocks/` — contains one Markdown file per annotated code block.

`archive/` — contains subdirectories mirroring the live annotation directories. Annotations are moved here when their target is deleted, superseded, or otherwise no longer live.

`index.json` — the canonical cross-link graph, block identity metric state, confidence scores, and relationship map for all live annotations. This file is rebuilt on every commit by the resolution hook.

`archive-index.json` — the cross-link graph for archived annotations. Maintains navigability of deleted and superseded code reasoning.

### 3.2 Initialization

Implementations MUST create all directories, an empty `index.json` (`{}`), and an empty `archive-index.json` (`{}`) on initialization. Implementations SHOULD install the commit-time resolution hook at initialization.

---

## 4. File Formats

### 4.1 Annotation Files

All annotation files MUST be Markdown with YAML frontmatter. The frontmatter is delimited by `---` on its own line at the start and end of the YAML block.

```markdown
---
key: value
---

# Human-Readable Title

Body content in Markdown.
```

The frontmatter MUST be valid YAML. The body MUST be valid Markdown. The combination MUST render correctly on GitHub without any Whytho-specific tooling.

### 4.2 Index Files

`index.json` and `archive-index.json` MUST be valid JSON conforming to the schemas defined in Sections 14 and 15 respectively.

### 4.3 Encoding

All files MUST be UTF-8 encoded.

---

## 5. Session Annotations

Session annotations live in `.why/sessions/` and capture the reasoning flow of a single AI coding session.

### 5.1 Filename

`{YYYY-MM-DD}-{slug}.md`

The slug MUST be a short, human-readable description of the session's primary objective using lowercase alphanumeric characters and hyphens.

### 5.2 Frontmatter Schema

```yaml
---
whytho: "1.0"
type: session
id: "2025-06-14-auth-refactor"
created: "2025-06-14T09:32:00Z"
ended: "2025-06-14T11:47:00Z"
model: "claude-sonnet-4-20250514"
model_provider: "anthropic"
user: "jdoe"
commits:
  - sha: "a1b2c3d"
    message: "feat: add token rotation to auth middleware"
    timestamp: "2025-06-14T10:15:00Z"
  - sha: "e4f5g6h"
    message: "test: add rotation edge case tests"
    timestamp: "2025-06-14T11:02:00Z"
folders_touched:
  - "src/auth/"
  - "tests/auth/"
files_touched:
  - "src/auth/middleware.ts"
  - "src/auth/tokens.ts"
  - "tests/auth/middleware.test.ts"
blocks_touched:
  - "src/auth/middleware.ts::rotateTokenIfNeeded"
  - "src/auth/tokens.ts::generateRefreshToken"
  - "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)"
tags:
  - auth
  - security
  - refactor
---
```

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `whytho` | string | Spec version. MUST be `"1.0"`. |
| `type` | string | MUST be `"session"`. |
| `id` | string | Unique session identifier. MUST match filename without extension. |
| `created` | string | ISO 8601 timestamp of session start. |
| `model` | string | Model identifier used during the session. |
| `commits` | array | Commits produced by the session. Each entry MUST have `sha`, `message`, and `timestamp`. |
| `files_touched` | array | Source file paths touched during the session, relative to repository root. |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `ended` | string | ISO 8601 timestamp of session end. |
| `model_provider` | string | Provider of the AI model. |
| `user` | string | Username or identifier of the human participant. |
| `folders_touched` | array | Source folder paths touched during the session. |
| `blocks_touched` | array | Symbolic references of blocks touched during the session. |
| `tags` | array | Freeform tags for categorization. |

### 5.3 Body Structure

The body of a session annotation MUST contain the following sections in order. Implementations MAY add additional sections after the required ones.

#### Objectives

A sequential list of objectives that emerged during the session. Objectives may be stated at the start or may have emerged during the session. Each objective SHOULD include whether it was completed, partially completed, or deferred.

```markdown
## Objectives

1. **Implement token rotation in auth middleware** — Completed.
   User requested automatic rotation of refresh tokens approaching expiry.

2. **Add edge case tests for rotation timing** — Completed.
   AI identified three edge cases around clock skew and concurrent rotation.

3. **Evaluate migration to asymmetric tokens** — Deferred.
   Investigated briefly, determined it requires a separate session due to scope.
```

#### Decisions

A list of decisions made during the session. Each decision MUST be tagged with its origin.

```markdown
## Decisions

### Use sliding window for token rotation
- **Origin:** collaborative
- **Context:** Needed to decide between fixed-interval and sliding-window rotation.
- **Decision:** Sliding window, triggered when remaining lifetime drops below 20% of
  original TTL.
- **Rationale:** Fixed interval causes unnecessary rotation for short-lived sessions.
  Sliding window only rotates tokens that are actually at risk of expiring during use.
- **Alternatives considered:**
  - Fixed 5-minute interval — rejected because it causes rotation storms under
    high concurrency.
  - Rotation on every request — rejected because it defeats token caching.

### Place rotation logic in middleware rather than token service
- **Origin:** ai
- **Context:** Rotation could live in the token service (closer to token generation)
  or in the middleware (closer to the request lifecycle).
- **Decision:** Middleware. The rotation decision depends on request context
  (is this a long-running operation?) which is not available in the token service.
- **Rationale:** Keeping rotation in the middleware avoids passing request context
  through the token service API, which would leak HTTP concerns into a domain service.
- **Uncertainty:** Moderate. If the token service later needs rotation awareness for
  background jobs, this decision may need revisiting.
```

**Decision origin values:**

| Value | Meaning |
|-------|---------|
| `user` | The human explicitly directed this decision. |
| `ai` | The AI made this decision autonomously. |
| `collaborative` | The decision emerged from discussion between the human and the AI. |

#### Uncertainty Log

A list of things the AI flagged as potentially wrong, incomplete, or worth revisiting.

```markdown
## Uncertainty Log

- **Clock skew handling:** The rotation window assumes synchronized clocks between
  the auth server and downstream services. If clock skew exceeds 30 seconds,
  tokens may be rotated unnecessarily or not rotated when they should be.
  Confidence: medium.

- **Concurrent rotation race condition:** Two simultaneous requests could both
  trigger rotation. The current implementation uses optimistic locking, but under
  extreme load this may cause failed rotations. Added a TODO for load testing.
  Confidence: low.
```

---

## 6. Folder Annotations

Folder annotations live in `.why/folders/` and capture per-folder architectural context.

### 6.1 Filename

Source path with `/` replaced by `--`, plus `.md`. The root folder annotation MUST be named `root.md`.

Examples:
- `src/auth/` → `src--auth.md`
- `src/` → `src.md`
- Repository root → `root.md`

### 6.2 Frontmatter Schema

```yaml
---
whytho: "1.0"
type: folder
path: "src/auth/"
created: "2025-06-14T09:32:00Z"
updated: "2025-06-14T11:47:00Z"
updated_by_session: "2025-06-14-auth-refactor"
parent_folder: "src/"
contained_files:
  - "src/auth/middleware.ts"
  - "src/auth/tokens.ts"
  - "src/auth/types.ts"
sessions:
  - "2025-06-14-auth-refactor"
  - "2025-06-10-initial-auth"
---
```

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `whytho` | string | MUST be `"1.0"`. |
| `type` | string | MUST be `"folder"`. |
| `path` | string | Folder path relative to repository root. `"/"` for root. |
| `created` | string | ISO 8601 timestamp of annotation creation. |
| `updated` | string | ISO 8601 timestamp of last update. |
| `updated_by_session` | string | Session ID that last updated this annotation. |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `parent_folder` | string | Path of the parent folder. Absent for root. |
| `contained_files` | array | Source file paths within this folder that have annotations. |
| `sessions` | array | Session IDs that have touched files within this folder. |

### 6.3 Body Structure

#### Purpose

A description of the folder's role in the codebase architecture.

```markdown
## Purpose

This folder contains the authentication and authorization middleware, token
management, and type definitions for the auth subsystem. All HTTP-layer auth
concerns live here; domain-level identity concepts live in `src/identity/`.
```

#### Structural Decisions

Decisions that apply to the folder as a whole.

```markdown
## Structural Decisions

### Middleware-first architecture
All auth checks are implemented as Express middleware rather than decorators or
inline guards. This was chosen for composability — middleware can be stacked,
reordered, and conditionally applied per route without modifying handler code.

### One file per concern
Each file addresses a single auth concern: `middleware.ts` for HTTP-layer checks,
`tokens.ts` for token lifecycle, `types.ts` for shared type definitions.
Cross-concern code belongs in the parent `src/` folder or in a shared utility.
```

#### Root Folder Specifics

The root folder annotation (`root.md`) MUST additionally contain:

```markdown
## Architecture

A description of the project's overall architecture, the intended relationships
between major sections, and global constraints.

## Canonical Patterns

Patterns that are considered current and preferred across the codebase.

## Legacy Patterns

Patterns that exist in the codebase but are considered deprecated or scheduled
for replacement, with notes on what should replace them.

## Global Constraints

Constraints that apply across the entire codebase — performance budgets,
dependency policies, compatibility requirements, regulatory constraints.
```

---

## 7. File Annotations

File annotations live in `.why/files/` and capture per-file context.

### 7.1 Filename

Source path with `/` replaced by `--`, plus `.md`.

Example: `src/auth/middleware.ts` → `src--auth--middleware.ts.md`

### 7.2 Frontmatter Schema

```yaml
---
whytho: "1.0"
type: file
path: "src/auth/middleware.ts"
created: "2025-06-14T09:32:00Z"
updated: "2025-06-14T11:47:00Z"
updated_by_session: "2025-06-14-auth-refactor"
parent_folder: "src/auth/"
sessions:
  - "2025-06-14-auth-refactor"
  - "2025-06-10-initial-auth"
blocks:
  - "src/auth/middleware.ts::rotateTokenIfNeeded"
  - "src/auth/middleware.ts::validateToken"
  - "src/auth/middleware.ts::authMiddleware"
language: "typescript"
---
```

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `whytho` | string | MUST be `"1.0"`. |
| `type` | string | MUST be `"file"`. |
| `path` | string | File path relative to repository root. |
| `created` | string | ISO 8601 timestamp of annotation creation. |
| `updated` | string | ISO 8601 timestamp of last update. |
| `updated_by_session` | string | Session ID that last updated this annotation. |
| `parent_folder` | string | Path of the containing folder. |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `sessions` | array | Session IDs that have touched this file. |
| `blocks` | array | Symbolic references of annotated blocks within this file. |
| `language` | string | Programming language of the source file. |

### 7.3 Body Structure

#### Purpose

Why this file exists and its role within the containing folder.

```markdown
## Purpose

This file implements the Express middleware stack for authentication. It is the
HTTP entry point for all auth concerns — token validation, rotation, and error
handling. Business logic for token generation and verification lives in
`tokens.ts`; this file orchestrates those operations within the request lifecycle.
```

#### Session Context

For each session that has touched this file, a section describing why the file was in scope and what changed.

```markdown
## Session: 2025-06-14-auth-refactor

**Why in scope:** Token rotation was added to the middleware layer. This file
received the `rotateTokenIfNeeded` function and modifications to `authMiddleware`
to call it.

**Changes:**
- Added `rotateTokenIfNeeded` function implementing sliding-window rotation.
- Modified `authMiddleware` to call rotation after successful validation.
- Added `X-Token-Rotated` response header when rotation occurs.
```

---

## 8. Block Annotations

Block annotations live in `.why/blocks/` and capture per-block context at the finest granularity.

### 8.1 Filename

Source path with `/` replaced by `--`, plus block name, plus `.md`.

Example: `src/auth/middleware.ts::rotateTokenIfNeeded` → `src--auth--middleware.ts--rotateTokenIfNeeded.md`

For blocks with non-filesystem-safe names (e.g., `describe("rotation")`), implementations MUST slugify the block name using lowercase alphanumeric characters and hyphens.

### 8.2 Frontmatter Schema

```yaml
---
whytho: "1.0"
type: block
symbolic_ref: "src/auth/middleware.ts::rotateTokenIfNeeded"
file: "src/auth/middleware.ts"
created: "2025-06-14T09:45:00Z"
updated: "2025-06-14T11:47:00Z"
created_by_session: "2025-06-14-auth-refactor"
updated_by_session: "2025-06-14-auth-refactor"
identity:
  symbolic: "src/auth/middleware.ts::rotateTokenIfNeeded"
  line_range:
    start: 42
    end: 78
    commit: "a1b2c3d"
  content_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  structural:
    kind: "function"
    parent_scope: "module"
    name: "rotateTokenIfNeeded"
    parameters: "(req: Request, res: Response, token: AuthToken)"
    index_in_parent: 2
  semantic_fingerprint: "Checks if an auth token is approaching expiry and rotates it using a sliding window algorithm, setting a response header on rotation."
  canonical_metric: "symbolic"
  confidence: 0.95
  last_resolved: "a1b2c3d"
relationships:
  - type: "depends_on"
    target: "src/auth/tokens.ts::generateRefreshToken"
  - type: "depends_on"
    target: "src/auth/tokens.ts::getTokenTTL"
  - type: "extends"
    target: "src/auth/middleware.ts::authMiddleware"
---
```

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `whytho` | string | MUST be `"1.0"`. |
| `type` | string | MUST be `"block"`. |
| `symbolic_ref` | string | Current symbolic reference in `file::name` format. |
| `file` | string | Path to the source file containing this block. |
| `created` | string | ISO 8601 timestamp of annotation creation. |
| `updated` | string | ISO 8601 timestamp of last update. |
| `created_by_session` | string | Session ID that created this annotation. |
| `updated_by_session` | string | Session ID that last updated this annotation. |
| `identity` | object | Block identity metrics. See Section 9. |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `relationships` | array | Relationship annotations. See Section 12. |
| `derived_from` | string | Symbolic reference of the block this was derived from (after split). |
| `parents` | array | Symbolic references of blocks that were merged to create this one. |
| `push_notes` | array | Developer-authored reasoning notes attached to this block. See Push Note Object below. |

#### Push Note Object

Each entry in `push_notes` is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `session` | string | Session ID (or `"agent-push"`) that created this note. |
| `timestamp` | string | ISO 8601 timestamp when the note was pushed. |
| `body` | string | The reasoning text authored by the developer or agent. |
| `status` | string | One of: `"active"` (visible to consumers), `"discarded_redundant"` (content already captured by inferred body), `"archived_conflict"` (contradicts the inferred body; preserved for audit). |

Only notes with `status: "active"` are included in rendered annotation output. Notes with other statuses are retained in the file for historical reference.

Push notes are assessed and reclassified each time the block annotation is regenerated. See Section 10 for the merge algorithm.

### 8.3 Identity Object Schema

The `identity` object MUST contain all of the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `symbolic` | string | Symbolic reference in `file::name` format. |
| `line_range` | object | `start` (int), `end` (int), `commit` (string). Line numbers at the specified commit. |
| `content_hash` | string | Hash of the block content in `algorithm:hex` format. MUST use SHA-256. |
| `structural` | object | Structural position. See below. |
| `semantic_fingerprint` | string | Natural language description of what the block does, generated by the AI. |
| `canonical_metric` | string | One of: `symbolic`, `line_range`, `content_hash`, `structural`, `semantic_fingerprint`. |
| `confidence` | number | Confidence score between 0.0 and 1.0, set by the resolver. |
| `last_resolved` | string | Commit SHA at which resolution last ran for this block. |

#### Structural Position Object

| Field | Type | Description |
|-------|------|-------------|
| `kind` | string | Type of block: `function`, `method`, `class`, `interface`, `type`, `const`, `config`, `describe`, `it`, `test`, or implementation-defined. |
| `parent_scope` | string | Name of the containing scope. `"module"` for top-level. |
| `name` | string | Name of the block. |
| `parameters` | string | Parameter signature, if applicable. |
| `index_in_parent` | integer | Zero-based index of this block among siblings of the same kind in the parent scope. |

### 8.4 Body Structure

#### Purpose

What the block does and why it exists.

```markdown
## Purpose

Checks whether an authenticated request's token is approaching expiry and, if so,
generates a new token and attaches it to the response via the `X-Token-Rotated`
header. This prevents token expiry during long-running operations without
requiring clients to implement their own refresh logic.
```

#### Tradeoffs and Alternatives

```markdown
## Tradeoffs

### Sliding window vs. fixed interval
A sliding window was chosen over a fixed rotation interval. The window triggers
rotation when remaining token lifetime drops below 20% of the original TTL.
This avoids rotation storms under high concurrency (which a fixed 5-minute
interval would cause) while still guaranteeing rotation before expiry.

### Optimistic locking for concurrent rotation
Under concurrent requests with the same token, multiple rotations could race.
The implementation uses optimistic locking against the token store rather than
distributed locks. This means a rotation can fail and fall through to the
next request, which is acceptable because a failed rotation means another
request already rotated the token.

### Response header vs. response body
The new token is delivered via a response header (`X-Token-Rotated`) rather
than modifying the response body. This keeps rotation transparent to endpoint
handlers and avoids breaking response schemas.
```

#### Uncertainty

```markdown
## Uncertainty

- **Clock skew tolerance:** The 20% window assumes < 30s clock skew between
  auth server and downstream services. Not validated in production.
  Confidence: medium.

- **Optimistic locking under extreme load:** Under sustained >10k concurrent
  requests per second, the failure-and-retry pattern may cause visible latency
  spikes. Load testing has not been performed at this scale.
  Confidence: low.

- **Header size limits:** If the rotated token is very large (>4KB), some
  reverse proxies may strip or truncate the header. The current token format
  is ~800 bytes, well within limits, but a future migration to JWTs with
  embedded claims could exceed this.
  Confidence: high (for current token format).
```

---

## 9. Block Identity

### 9.1 Rationale

Block annotations must remain linked to the code they describe across all change types: edits, renames, moves between files, refactors, splits, merges, and rewrites. No single identifier is stable across all these change types. The standard therefore tracks multiple simultaneous identity metrics and elects a canonical metric based on which metrics agree.

### 9.2 Identity Metrics

#### Symbolic Reference

Format: `{file_path}::{block_name}`

Example: `src/auth/middleware.ts::rotateTokenIfNeeded`

Human-readable. Breaks on rename or file move. Used as the primary human-facing identifier and as the annotation filename basis.

#### Line Range

Format: `{ start: int, end: int, commit: string }`

The line range is anchored to a specific commit SHA. It goes stale on any edit to the file. It is refreshed at resolution time.

#### Content Hash

Format: `sha256:{hex}`

The SHA-256 hash of the block's source code content, with leading and trailing whitespace trimmed and line endings normalized to `\n` before hashing.

Stable across renames and moves. Breaks on any internal change, however minor.

#### Structural Position

Format: `{ kind, parent_scope, name, parameters, index_in_parent }`

Captures the block's type, its position in the AST, its name, its parameter signature, and its index among siblings. Relatively stable across content changes and minor refactors. Breaks when the block is moved to a different scope or its signature changes.

#### Semantic Fingerprint

Format: free-text string, typically 1–3 sentences.

A natural language description of what the block does, generated by the AI at annotation time. The most robust metric under heavy refactoring — a block that is completely rewritten but still does the same thing will retain its semantic fingerprint. However, matching requires AI evaluation, making it the most expensive metric to resolve.

### 9.3 Canonical Metric Election

The resolver MUST evaluate all five metrics on every resolution pass and elect a canonical metric according to the following protocol:

1. **Symbolic + structural agree** → `symbolic` is canonical.
   "Agree" means: the symbolic reference resolves to a block in the source file, and that block's structural position matches the stored structural position within tolerance (kind, parent_scope, and name must match exactly; parameters and index_in_parent may differ).

2. **Symbolic broken, content hash + structural agree** → `structural` is canonical.
   "Symbolic broken" means: the symbolic reference no longer resolves to any block in the expected file. "Agree" means: a block exists in the codebase with the stored content hash, and its structural position matches within tolerance.

3. **Symbolic broken, hash broken, structural matches** → `structural` is canonical with reduced confidence.
   If the structural position matches a block but the content hash does not, the block has been edited in place. The resolver SHOULD update the content hash and line range while retaining the structural metric as canonical.

4. **Only semantic fingerprint matches** → resolver performs AI-assisted matching.
   The resolver presents the semantic fingerprint and candidate blocks to an AI evaluator. If the evaluator confirms a match with confidence ≥ 0.7, the match is accepted, a new symbolic reference is nominated, and all metrics are refreshed. If confidence is below 0.7, the annotation is flagged as `UNRESOLVABLE`.

5. **No metrics match above threshold** → `UNRESOLVABLE`.
   The annotation is frozen at its last known state and flagged for human review.

Implementations MUST record which metric is canonical and MUST record the confidence score. Implementations SHOULD make the confidence threshold configurable.

---

## 10. Commit-Time Resolution

### 10.1 Trigger

Resolution MUST run on every commit via a git hook (pre-commit or post-commit, at the implementer's discretion). Implementations SHOULD use a post-commit hook by default so that resolution does not block the commit, but MAY use a pre-commit hook in strict mode where blocking is desired.

### 10.2 Process

For every live block annotation:

1. Retrieve the current state of the source file at HEAD.
2. Locate the block using the canonical metric.
3. If found, evaluate all five metrics against the located block.
4. Determine the resolution outcome.
5. Update the annotation frontmatter.
6. Rebuild `index.json`.

### 10.3 Resolution Outcomes

#### RESOLVED

The block was found at its expected location. Metrics may have been refreshed (e.g., line range updated after a nearby edit), but the block's identity is confirmed.

Frontmatter updates:
- `identity.line_range` refreshed.
- `identity.content_hash` refreshed if content changed.
- `identity.canonical_metric` re-elected.
- `identity.confidence` updated.
- `identity.last_resolved` set to current commit SHA.
- `updated` set to current timestamp.

#### RELOCATED

The block was found at a different location than expected (different line range, possibly different file) but identity was confirmed by matching metrics.

Frontmatter updates:
- All identity metrics refreshed.
- `identity.canonical_metric` re-elected.
- `file` updated if the block moved to a different file.
- `symbolic_ref` updated if the file path changed.
- Annotation file renamed if the symbolic reference changed.

#### RENAMED

The block's name changed but identity was confirmed by structural position, content hash, or semantic fingerprint.

Frontmatter updates:
- `identity.symbolic` updated.
- `symbolic_ref` updated.
- `identity.structural.name` updated.
- Other metrics refreshed.
- Annotation file renamed to match new symbolic reference.

#### SPLIT

One block became two or more blocks. The resolver detects this when the original block no longer exists, but two or more blocks in the file have content that partially matches the original content hash or structural position.

Actions:
- Original annotation moved to `archive/blocks/` with reason `"split"`.
- New annotation created for each resulting block with `derived_from` set to the original's symbolic reference.
- New annotations flagged for re-annotation (body content may be stale).
- `index.json` updated. `archive-index.json` updated.

#### MERGED

Two or more blocks became one. The resolver detects this when multiple annotated blocks no longer exist, but a single new block's content or structure incorporates elements of both.

Actions:
- All original annotations moved to `archive/blocks/` with reason `"merged"`.
- New annotation created for the merged block with `parents` set to the original symbolic references.
- New annotation flagged for re-annotation.
- `index.json` updated. `archive-index.json` updated.

#### DELETED

The block no longer exists in the source file and no relocation, rename, split, or merge was detected.

Actions:
- Annotation moved to `archive/blocks/` with reason `"deleted"`.
- `by_session` set to the session that produced the deleting commit (if determinable) or `"unknown"`.
- `index.json` updated. `archive-index.json` updated.

#### SUPERSEDED

The block exists at the expected location but has been so thoroughly rewritten that the content hash, structural position, and semantic fingerprint all fail to match. The resolver determines that this is conceptually new code occupying the same location rather than a modified version of the original.

Actions:
- Original annotation moved to `archive/blocks/` with reason `"superseded"`.
- Stub annotation created at the same symbolic reference, flagged for re-annotation, with `derived_from` pointing to the original.
- `index.json` updated. `archive-index.json` updated.

Implementations SHOULD flag `SUPERSEDED` only when confidence in identity continuity drops below a configurable threshold (default: 0.3). Above this threshold, the outcome SHOULD be `RESOLVED` with updated metrics.

### 10.4 Push Note Merge on Reannotation

When an implementation regenerates a block annotation body (reannotation), it MUST run a merge algorithm to reconcile existing developer-authored push notes with the new inferred body. The algorithm is:

1. Separate `push_notes` into **active** (`status: "active"`) and **inactive** (all other statuses).
2. Inactive notes pass through to the output unchanged.
3. For each active note, assess it against the new inferred body using one of:
   - An AI classification call that classifies the note as COMPLEMENTARY, REDUNDANT, or CONFLICT relative to the inferred body.
   - If no AI is available, treat all notes as COMPLEMENTARY (safe default).
4. Apply verdicts:
   - **COMPLEMENTARY** — The note adds information not captured by the inferred body. Retain with `status: "active"`.
   - **REDUNDANT** — The note's content is already captured in the inferred body. Set `status: "discarded_redundant"`.
   - **CONFLICT** — The note contradicts a factual claim in the inferred body. Set `status: "archived_conflict"`.
5. Write the new inferred body and the merged `push_notes` array to the annotation file.

When rendering annotation output to consumers (agents, tools, UIs), implementations MUST include only notes with `status: "active"`. Inactive notes remain in the file for audit purposes.

#### UNRESOLVABLE

No metric matches above the confidence threshold and AI-assisted semantic matching (if available) was unable to confirm identity.

Actions:
- Annotation frozen at its last known state.
- `identity.confidence` set to 0.0.
- `identity.canonical_metric` set to `"none"`.
- A `resolution_status: "unresolvable"` field added to frontmatter.
- Flagged for human review in `index.json`.

---

## 11. Cross-Linking

### 11.1 Principle

Every annotation MUST maintain bidirectional links to related annotations at all levels. These links are stored in both the individual annotation frontmatter and in `index.json`. Implementations MUST keep both representations in sync. When they conflict, `index.json` is authoritative.

### 11.2 Link Directions

| Annotation Type | Links To |
|-----------------|----------|
| Session | All folders, files, and blocks it touched. |
| Folder | Parent folder (if any), contained file annotations, and sessions that touched files within. |
| File | Parent folder, sessions that touched this file, and all block annotations within. |
| Block | Parent file, creating session, updating session(s), and relationship targets. |

### 11.3 Link Maintenance

Links MUST be updated during resolution. When a block is relocated to a new file, its parent file link MUST be updated in both the annotation frontmatter and `index.json`. When a session produces new annotations, those annotations MUST be added to the relevant file and folder link lists.

---

## 12. Relationship Annotations

### 12.1 Purpose

Block annotations MAY declare relationships to other blocks. Relationships enable tooling to propagate change awareness: when a relationship target changes, interested parties can be notified.

### 12.2 Vocabulary

Relationships use a controlled vocabulary:

| Type | Meaning |
|------|---------|
| `extends` | This block extends or augments the target block's functionality. |
| `depends_on` | This block calls, imports, or requires the target block to function. |
| `implements` | This block implements an interface, contract, or specification defined by the target block. |
| `tests` | This block is a test for the target block. |

### 12.3 Schema

Each relationship entry in a block annotation's `relationships` array MUST have:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | One of the vocabulary values listed above. |
| `target` | string | Symbolic reference of the target block. |

Implementations MAY add optional fields:

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Human-readable description of the relationship. |
| `bidirectional` | boolean | If `true`, the target block SHOULD also declare the inverse relationship. Default: `false`. |

### 12.4 Inverse Relationships

The standard does not require that both sides of a relationship be annotated. However, implementations SHOULD support querying relationships in both directions using `index.json`. The index MUST store relationship edges in a format that supports both forward and reverse traversal.

---

## 13. Hook Event Contract

### 13.1 Purpose

When a relationship target changes, the standard defines a hook event that implementations MUST emit. Hook consumers decide how to respond. The standard defines the event contract, not the response.

### 13.2 Event Schema

```json
{
  "event": "relationship_target_changed",
  "whytho_version": "1.0",
  "timestamp": "2025-06-14T11:47:00Z",
  "commit": "a1b2c3d",
  "session": "2025-06-14-auth-refactor",
  "relationship": {
    "type": "depends_on",
    "source": "src/auth/middleware.ts::rotateTokenIfNeeded",
    "target": "src/auth/tokens.ts::generateRefreshToken"
  },
  "change": {
    "type": "modified",
    "target_resolution": "RESOLVED",
    "target_previous_hash": "sha256:abc123...",
    "target_current_hash": "sha256:def456...",
    "target_confidence": 0.92
  }
}
```

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | MUST be `"relationship_target_changed"`. |
| `whytho_version` | string | Spec version. |
| `timestamp` | string | ISO 8601 timestamp of the event. |
| `commit` | string | Commit SHA that triggered the event. |
| `relationship.type` | string | Relationship type from the vocabulary. |
| `relationship.source` | string | Symbolic reference of the source block (the one declaring the relationship). |
| `relationship.target` | string | Symbolic reference of the target block (the one that changed). |
| `change.type` | string | One of: `modified`, `relocated`, `renamed`, `split`, `merged`, `deleted`, `superseded`. |
| `change.target_resolution` | string | Resolution outcome for the target block. |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `session` | string | Session ID that produced the triggering commit. |
| `change.target_previous_hash` | string | Content hash of the target before the change. |
| `change.target_current_hash` | string | Content hash of the target after the change. |
| `change.target_confidence` | number | Confidence score of the target's resolution. |

### 13.3 Emission

Implementations MUST emit hook events after resolution completes for each commit. Events MUST be emitted for every relationship where the target block's resolution outcome is anything other than `RESOLVED` with unchanged content hash, or where the target block's content hash has changed.

### 13.4 Consumption

The standard does not define how hook events are consumed. Implementations MAY deliver events via any mechanism: writing to a file, posting to a webhook, invoking a script, emitting to a message queue, or integrating with CI/CD systems.

Example consumer behaviors (illustrative, not normative):
- A `tests` relationship target changes → consumer runs the test suite.
- A `depends_on` target is `DELETED` → consumer notifies the source block's maintainer.
- A `configures` target is `SUPERSEDED` → consumer triggers an agent to review the configuration.
- A `implements` target is `SPLIT` → consumer blocks the commit until the implementation is updated.

---

## 14. Index Schema

`index.json` is the canonical representation of the live annotation graph. It MUST be rebuilt on every commit by the resolution hook.

### 14.1 Top-Level Schema

```json
{
  "whytho_version": "1.0",
  "generated_at": "2025-06-14T11:47:00Z",
  "generated_at_commit": "a1b2c3d",
  "sessions": { ... },
  "folders": { ... },
  "files": { ... },
  "blocks": { ... },
  "relationships": [ ... ],
  "unresolved": [ ... ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `whytho_version` | string | Spec version. |
| `generated_at` | string | ISO 8601 timestamp of last rebuild. |
| `generated_at_commit` | string | Commit SHA at which the index was built. |
| `sessions` | object | Map of session ID to session index entry. |
| `folders` | object | Map of folder path to folder index entry. |
| `files` | object | Map of file path to file index entry. |
| `blocks` | object | Map of symbolic reference to block index entry. |
| `relationships` | array | All live relationship edges. |
| `unresolved` | array | Symbolic references of blocks with `UNRESOLVABLE` status. |

### 14.2 Session Index Entry

```json
{
  "id": "2025-06-14-auth-refactor",
  "created": "2025-06-14T09:32:00Z",
  "folders_touched": ["src/auth/", "tests/auth/"],
  "files_touched": ["src/auth/middleware.ts", "src/auth/tokens.ts"],
  "blocks_touched": ["src/auth/middleware.ts::rotateTokenIfNeeded"],
  "commits": ["a1b2c3d", "e4f5g6h"]
}
```

### 14.3 Folder Index Entry

```json
{
  "path": "src/auth/",
  "parent_folder": "src/",
  "contained_files": ["src/auth/middleware.ts", "src/auth/tokens.ts"],
  "sessions": ["2025-06-14-auth-refactor"]
}
```

### 14.4 File Index Entry

```json
{
  "path": "src/auth/middleware.ts",
  "parent_folder": "src/auth/",
  "blocks": ["src/auth/middleware.ts::rotateTokenIfNeeded", "src/auth/middleware.ts::validateToken"],
  "sessions": ["2025-06-14-auth-refactor"]
}
```

### 14.5 Block Index Entry

```json
{
  "symbolic_ref": "src/auth/middleware.ts::rotateTokenIfNeeded",
  "file": "src/auth/middleware.ts",
  "canonical_metric": "symbolic",
  "confidence": 0.95,
  "last_resolved": "a1b2c3d",
  "content_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "created_by_session": "2025-06-14-auth-refactor",
  "updated_by_session": "2025-06-14-auth-refactor",
  "relationships_out": [
    { "type": "depends_on", "target": "src/auth/tokens.ts::generateRefreshToken" },
    { "type": "extends", "target": "src/auth/middleware.ts::authMiddleware" }
  ],
  "relationships_in": [
    { "type": "tests", "source": "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)" }
  ]
}
```

Note: `relationships_out` lists relationships declared *by* this block. `relationships_in` lists relationships declared by other blocks *targeting* this block. This enables bidirectional traversal without requiring both sides to explicitly annotate the relationship.

### 14.6 Relationship Edge

```json
{
  "type": "depends_on",
  "source": "src/auth/middleware.ts::rotateTokenIfNeeded",
  "target": "src/auth/tokens.ts::generateRefreshToken"
}
```

The `relationships` array MUST contain one entry for every relationship declared in any live block annotation. This array is the canonical list used for hook event evaluation.

---

## 15. Archive Index Schema

`archive-index.json` maintains the cross-link graph for archived annotations. Its structure mirrors `index.json` with the addition of archival metadata.

### 15.1 Top-Level Schema

```json
{
  "whytho_version": "1.0",
  "generated_at": "2025-06-14T11:47:00Z",
  "sessions": { ... },
  "folders": { ... },
  "files": { ... },
  "blocks": { ... }
}
```

### 15.2 Archived Block Entry

```json
{
  "symbolic_ref": "src/auth/middleware.ts::oldRotateToken",
  "file": "src/auth/middleware.ts",
  "archived_at": "2025-06-14T11:47:00Z",
  "archived_reason": "superseded",
  "archived_by_session": "2025-06-14-auth-refactor",
  "archived_at_commit": "a1b2c3d",
  "successor": "src/auth/middleware.ts::rotateTokenIfNeeded",
  "last_known_confidence": 0.85,
  "last_known_content_hash": "sha256:aabbcc..."
}
```

#### Archival-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| `archived_at` | string | ISO 8601 timestamp of archival. |
| `archived_reason` | string | One of: `deleted`, `superseded`, `split`, `merged`. |
| `archived_by_session` | string | Session ID that caused archival, or `"unknown"`. |
| `archived_at_commit` | string | Commit SHA at which archival occurred. |
| `successor` | string | Symbolic reference of the replacing block, if applicable. |
| `last_known_confidence` | number | Confidence score at time of archival. |
| `last_known_content_hash` | string | Content hash at time of archival. |

---

## 16. Archival

### 16.1 Principle

Annotations are never permanently deleted. When their target ceases to exist or is no longer identifiable, they are moved to the `archive/` directory with archival metadata added to their frontmatter.

### 16.2 Archival Metadata

The following fields MUST be added to the frontmatter of archived annotations:

```yaml
archived_at: "2025-06-14T11:47:00Z"
archived_reason: "deleted"
archived_by_session: "2025-06-14-auth-refactor"
archived_at_commit: "a1b2c3d"
```

### 16.3 Archive Directory Structure

Archived files maintain the same naming convention and are placed in the corresponding archive subdirectory:

```
.why/archive/
  sessions/    ← archived session annotations (rare; for abandoned sessions)
  folders/     ← archived folder annotations (when folders are removed)
  files/       ← archived file annotations (when files are deleted)
  blocks/      ← archived block annotations (most common)
```

### 16.4 Collision Handling

If an archived annotation filename collides with an existing archived annotation (e.g., a block at the same symbolic reference was previously archived), implementations MUST append a numeric suffix: `{filename}-2.md`, `{filename}-3.md`, etc.

### 16.5 Archive Navigability

Archived annotations MUST remain navigable via `archive-index.json`. Tooling SHOULD support queries like "why was this function deleted?" and "what reasoning existed for code that used to be here?" by traversing the archive index.

---

## 17. Versioning

### 17.1 Specification Versioning

This specification follows [Semantic Versioning 2.0.0](https://semver.org/).

- **Major version** (e.g., 1.0 → 2.0): Breaking changes to file formats, schemas, or resolution protocol. Implementations of version N are not required to support version N+1 files without migration.
- **Minor version** (e.g., 1.0 → 1.1): Additive changes — new optional fields, new relationship types, new resolution outcomes. Implementations of version 1.0 MUST be able to read version 1.1 files by ignoring unknown fields.
- **Patch version** (e.g., 1.0.0 → 1.0.1): Clarifications, typo fixes, and non-functional changes to the specification text.

### 17.2 File-Level Version

Every annotation file and index file includes a `whytho` (or `whytho_version` for JSON) field containing the major.minor version of the specification it conforms to. Implementations MUST check this field and MUST refuse to process files with an unsupported major version.

### 17.3 Migration

When a new major version is released, the specification MUST include a migration guide describing how to transform files from the previous version. Implementations SHOULD provide automated migration tooling.

---

## 18. Guidance for Implementers

### 18.1 Resolution Hook

The resolution hook is the most critical component of any Whytho implementation. It MUST be reliable, fast, and deterministic (given the same inputs). Recommendations:

- Run resolution incrementally: only process blocks in files that changed in the current commit, not the entire codebase.
- Cache parsed ASTs for structural position evaluation.
- Perform semantic fingerprint matching only as a fallback when faster metrics fail — it requires AI inference and is the most expensive step.
- Make the confidence threshold for `UNRESOLVABLE` configurable, defaulting to 0.3.
- Make the confidence threshold for `SUPERSEDED` vs. `RESOLVED` configurable, defaulting to 0.3.

### 18.2 Annotation Granularity

The standard does not mandate what constitutes a "block." Implementations SHOULD default to functions, methods, classes, and type definitions. Implementations MAY support finer granularity (individual statements, expressions) or coarser granularity (sections of a file delineated by comments) based on user configuration.

### 18.3 Content Hash Normalization

Before computing the content hash, implementations MUST:
1. Strip leading and trailing whitespace from the block content.
2. Normalize line endings to `\n`.
3. Compute SHA-256 over the resulting UTF-8 bytes.

Implementations MUST NOT normalize internal whitespace, indentation, or comment content.

### 18.4 Index Rebuild Performance

For large repositories, rebuilding `index.json` from scratch on every commit may be prohibitively slow. Implementations SHOULD support incremental index updates: read the existing index, apply changes from the current commit's resolution, and write the updated index.

### 18.5 Git Integration

Implementations SHOULD provide:
- A `git why init` command that creates the `.why/` folder structure and installs the hook.
- A `git why annotate` command that generates annotations for the current session.
- A `git why` query interface for exploring annotations.
- A `git why search` command for text and semantic search across annotations.
- A `git why scan` command for running static relationship scanning across the repo.
- A `git why diff` command that overlays annotation context onto standard diffs.
- A `git why resolve` command for manually running resolution outside of the commit hook.

### 18.6 AI Model Independence

The specification is model-agnostic. Any AI system capable of producing YAML frontmatter and Markdown body content that conforms to this specification can serve as an annotation producer. Any AI system capable of evaluating semantic fingerprints can serve as a resolver. Implementations SHOULD NOT hard-code dependencies on specific AI models or providers.

### 18.7 Existing Codebases

For repositories adopting Whytho after significant development has occurred, implementations SHOULD provide a bulk annotation mode that generates folder, file, and block annotations for existing code. These annotations SHOULD be tagged with a synthetic session ID (e.g., `initial-annotation`) and SHOULD clearly note in their body content that they were generated retrospectively rather than during the original development session.

### 18.8 `.gitattributes` Considerations

Implementations SHOULD recommend adding the following to `.gitattributes`:

```
.why/** linguist-generated=true
.why/index.json merge=union
```

The `linguist-generated` attribute prevents annotation files from inflating contribution statistics. The `merge=union` attribute on `index.json` reduces merge conflicts, though implementations SHOULD still provide a custom merge driver for index files in repositories with high concurrency.

### 18.9 Privacy and Sensitive Information

Annotation producers MUST NOT include sensitive information such as API keys, credentials, PII, or proprietary business logic in annotation body content. Implementations SHOULD provide a content filter that scans annotations before writing them to disk.

Session annotations include a `user` field. Implementations MUST allow this field to be omitted or pseudonymized in environments where contributor identity is sensitive.

---

## Appendix A: Complete Example — Block Annotation

```markdown
---
whytho: "1.0"
type: block
symbolic_ref: "src/auth/middleware.ts::rotateTokenIfNeeded"
file: "src/auth/middleware.ts"
created: "2025-06-14T09:45:00Z"
updated: "2025-06-14T11:47:00Z"
created_by_session: "2025-06-14-auth-refactor"
updated_by_session: "2025-06-14-auth-refactor"
identity:
  symbolic: "src/auth/middleware.ts::rotateTokenIfNeeded"
  line_range:
    start: 42
    end: 78
    commit: "a1b2c3d"
  content_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  structural:
    kind: "function"
    parent_scope: "module"
    name: "rotateTokenIfNeeded"
    parameters: "(req: Request, res: Response, token: AuthToken)"
    index_in_parent: 2
  semantic_fingerprint: "Checks if an auth token is approaching expiry and rotates it using a sliding window algorithm, setting a response header on rotation."
  canonical_metric: "symbolic"
  confidence: 0.95
  last_resolved: "a1b2c3d"
relationships:
  - type: "depends_on"
    target: "src/auth/tokens.ts::generateRefreshToken"
  - type: "depends_on"
    target: "src/auth/tokens.ts::getTokenTTL"
  - type: "extends"
    target: "src/auth/middleware.ts::authMiddleware"
---

# rotateTokenIfNeeded

## Purpose

Checks whether an authenticated request's token is approaching expiry and, if so,
generates a new token and attaches it to the response via the `X-Token-Rotated`
header. This prevents token expiry during long-running operations without requiring
clients to implement their own refresh logic.

## Tradeoffs

### Sliding window vs. fixed interval
A sliding window was chosen over a fixed rotation interval. The window triggers
rotation when remaining token lifetime drops below 20% of the original TTL. This
avoids rotation storms under high concurrency (which a fixed 5-minute interval
would cause) while still guaranteeing rotation before expiry.

### Optimistic locking for concurrent rotation
Under concurrent requests with the same token, multiple rotations could race. The
implementation uses optimistic locking against the token store rather than
distributed locks. This means a rotation can fail and fall through to the next
request, which is acceptable because a failed rotation means another request
already rotated the token.

### Response header vs. response body
The new token is delivered via a response header (`X-Token-Rotated`) rather than
modifying the response body. This keeps rotation transparent to endpoint handlers
and avoids breaking response schemas.

## Uncertainty

- **Clock skew tolerance:** The 20% window assumes < 30s clock skew between auth
  server and downstream services. Not validated in production. Confidence: medium.

- **Optimistic locking under extreme load:** Under sustained >10k concurrent
  requests per second, the failure-and-retry pattern may cause visible latency
  spikes. Load testing has not been performed at this scale. Confidence: low.

- **Header size limits:** If the rotated token is very large (>4KB), some reverse
  proxies may strip or truncate the header. The current token format is ~800 bytes,
  well within limits, but a future migration to JWTs with embedded claims could
  exceed this. Confidence: high (for current token format).
```

## Appendix B: Complete Example — Session Annotation

```markdown
---
whytho: "1.0"
type: session
id: "2025-06-14-auth-refactor"
created: "2025-06-14T09:32:00Z"
ended: "2025-06-14T11:47:00Z"
model: "claude-sonnet-4-20250514"
model_provider: "anthropic"
user: "jdoe"
commits:
  - sha: "a1b2c3d"
    message: "feat: add token rotation to auth middleware"
    timestamp: "2025-06-14T10:15:00Z"
  - sha: "e4f5g6h"
    message: "test: add rotation edge case tests"
    timestamp: "2025-06-14T11:02:00Z"
folders_touched:
  - "src/auth/"
  - "tests/auth/"
files_touched:
  - "src/auth/middleware.ts"
  - "src/auth/tokens.ts"
  - "tests/auth/middleware.test.ts"
blocks_touched:
  - "src/auth/middleware.ts::rotateTokenIfNeeded"
  - "src/auth/tokens.ts::generateRefreshToken"
  - "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)"
tags:
  - auth
  - security
  - refactor
---

# Session: Auth Token Rotation Refactor

## Objectives

1. **Implement token rotation in auth middleware** — Completed.
   User requested automatic rotation of refresh tokens approaching expiry.
   Implemented as a sliding-window check in the middleware layer.

2. **Add edge case tests for rotation timing** — Completed.
   AI identified three edge cases: clock skew beyond tolerance, concurrent
   rotation with optimistic locking failure, and rotation of tokens with
   less than 1 second remaining TTL.

3. **Evaluate migration to asymmetric tokens** — Deferred.
   Investigated briefly. Migration requires changes to the token service,
   key management infrastructure, and all downstream consumers. Determined
   this requires a dedicated session due to scope.

## Decisions

### Use sliding window for token rotation
- **Origin:** collaborative
- **Context:** Needed to decide between fixed-interval and sliding-window rotation.
- **Decision:** Sliding window, triggered when remaining lifetime drops below 20%
  of original TTL.
- **Rationale:** Fixed interval causes unnecessary rotation for short-lived sessions.
  Sliding window only rotates tokens that are actually at risk of expiring during use.
- **Alternatives considered:**
  - Fixed 5-minute interval — rejected because it causes rotation storms under
    high concurrency.
  - Rotation on every request — rejected because it defeats token caching.

### Place rotation logic in middleware rather than token service
- **Origin:** ai
- **Context:** Rotation could live in the token service (closer to token generation)
  or in the middleware (closer to the request lifecycle).
- **Decision:** Middleware. The rotation decision depends on request context
  (is this a long-running operation?) which is not available in the token service.
- **Rationale:** Keeping rotation in the middleware avoids passing request context
  through the token service API, which would leak HTTP concerns into a domain service.
- **Uncertainty:** Moderate. If the token service later needs rotation awareness for
  background jobs, this decision may need revisiting.

### Use optimistic locking for concurrent rotation safety
- **Origin:** ai
- **Context:** Two simultaneous requests with the same token could both attempt rotation.
- **Decision:** Optimistic locking against the token store. If a rotation fails because
  the token was already rotated, the request falls through to the next request cycle.
- **Rationale:** Distributed locks add latency and a failure mode (lock timeout) to
  every authenticated request. Optimistic locking is zero-overhead in the non-contended
  case and gracefully degrades under contention.
- **Alternatives considered:**
  - Distributed lock (Redis) — rejected due to latency overhead on all requests.
  - Single-writer rotation service — rejected due to added infrastructure complexity.

## Uncertainty Log

- **Clock skew handling:** The rotation window assumes synchronized clocks between
  the auth server and downstream services. If clock skew exceeds 30 seconds, tokens
  may be rotated unnecessarily or not rotated when they should be. Confidence: medium.

- **Concurrent rotation race condition:** Under extreme load, the optimistic locking
  pattern may cause visible latency spikes. Load testing at >10k rps has not been
  performed. Confidence: low.

- **Asymmetric token migration path:** The decision to defer asymmetric tokens means
  the current symmetric token format is now more deeply embedded. Migration cost
  increases with each new consumer added. Confidence: high that this is a real
  concern, low on the urgency.
```

## Appendix C: Complete Example — index.json

```json
{
  "whytho_version": "1.0",
  "generated_at": "2025-06-14T11:47:00Z",
  "generated_at_commit": "e4f5g6h",
  "sessions": {
    "2025-06-14-auth-refactor": {
      "id": "2025-06-14-auth-refactor",
      "created": "2025-06-14T09:32:00Z",
      "folders_touched": ["src/auth/", "tests/auth/"],
      "files_touched": [
        "src/auth/middleware.ts",
        "src/auth/tokens.ts",
        "tests/auth/middleware.test.ts"
      ],
      "blocks_touched": [
        "src/auth/middleware.ts::rotateTokenIfNeeded",
        "src/auth/tokens.ts::generateRefreshToken",
        "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)"
      ],
      "commits": ["a1b2c3d", "e4f5g6h"]
    }
  },
  "folders": {
    "src/auth/": {
      "path": "src/auth/",
      "parent_folder": "src/",
      "contained_files": [
        "src/auth/middleware.ts",
        "src/auth/tokens.ts",
        "src/auth/types.ts"
      ],
      "sessions": ["2025-06-14-auth-refactor", "2025-06-10-initial-auth"]
    },
    "tests/auth/": {
      "path": "tests/auth/",
      "parent_folder": "tests/",
      "contained_files": ["tests/auth/middleware.test.ts"],
      "sessions": ["2025-06-14-auth-refactor"]
    }
  },
  "files": {
    "src/auth/middleware.ts": {
      "path": "src/auth/middleware.ts",
      "parent_folder": "src/auth/",
      "blocks": [
        "src/auth/middleware.ts::rotateTokenIfNeeded",
        "src/auth/middleware.ts::validateToken",
        "src/auth/middleware.ts::authMiddleware"
      ],
      "sessions": ["2025-06-14-auth-refactor", "2025-06-10-initial-auth"]
    },
    "src/auth/tokens.ts": {
      "path": "src/auth/tokens.ts",
      "parent_folder": "src/auth/",
      "blocks": [
        "src/auth/tokens.ts::generateRefreshToken",
        "src/auth/tokens.ts::getTokenTTL"
      ],
      "sessions": ["2025-06-14-auth-refactor"]
    },
    "tests/auth/middleware.test.ts": {
      "path": "tests/auth/middleware.test.ts",
      "parent_folder": "tests/auth/",
      "blocks": [
        "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)"
      ],
      "sessions": ["2025-06-14-auth-refactor"]
    }
  },
  "blocks": {
    "src/auth/middleware.ts::rotateTokenIfNeeded": {
      "symbolic_ref": "src/auth/middleware.ts::rotateTokenIfNeeded",
      "file": "src/auth/middleware.ts",
      "canonical_metric": "symbolic",
      "confidence": 0.95,
      "last_resolved": "e4f5g6h",
      "content_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb924...",
      "created_by_session": "2025-06-14-auth-refactor",
      "updated_by_session": "2025-06-14-auth-refactor",
      "relationships_out": [
        { "type": "depends_on", "target": "src/auth/tokens.ts::generateRefreshToken" },
        { "type": "depends_on", "target": "src/auth/tokens.ts::getTokenTTL" },
        { "type": "extends", "target": "src/auth/middleware.ts::authMiddleware" }
      ],
      "relationships_in": [
        { "type": "tests", "source": "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)" }
      ]
    },
    "src/auth/tokens.ts::generateRefreshToken": {
      "symbolic_ref": "src/auth/tokens.ts::generateRefreshToken",
      "file": "src/auth/tokens.ts",
      "canonical_metric": "symbolic",
      "confidence": 0.92,
      "last_resolved": "e4f5g6h",
      "content_hash": "sha256:aabbccdd...",
      "created_by_session": "2025-06-14-auth-refactor",
      "updated_by_session": "2025-06-14-auth-refactor",
      "relationships_out": [],
      "relationships_in": [
        { "type": "depends_on", "source": "src/auth/middleware.ts::rotateTokenIfNeeded" }
      ]
    },
    "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)": {
      "symbolic_ref": "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)",
      "file": "tests/auth/middleware.test.ts",
      "canonical_metric": "symbolic",
      "confidence": 0.90,
      "last_resolved": "e4f5g6h",
      "content_hash": "sha256:ffeeddcc...",
      "created_by_session": "2025-06-14-auth-refactor",
      "updated_by_session": "2025-06-14-auth-refactor",
      "relationships_out": [
        { "type": "tests", "target": "src/auth/middleware.ts::rotateTokenIfNeeded" }
      ],
      "relationships_in": []
    }
  },
  "relationships": [
    { "type": "depends_on", "source": "src/auth/middleware.ts::rotateTokenIfNeeded", "target": "src/auth/tokens.ts::generateRefreshToken" },
    { "type": "depends_on", "source": "src/auth/middleware.ts::rotateTokenIfNeeded", "target": "src/auth/tokens.ts::getTokenTTL" },
    { "type": "extends", "source": "src/auth/middleware.ts::rotateTokenIfNeeded", "target": "src/auth/middleware.ts::authMiddleware" },
    { "type": "tests", "source": "tests/auth/middleware.test.ts::describe(rotateTokenIfNeeded)", "target": "src/auth/middleware.ts::rotateTokenIfNeeded" }
  ],
  "unresolved": []
}
```

---

*End of specification.*
