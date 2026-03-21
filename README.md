# Whytho

### The open standard for persisting AI reasoning alongside your code.

```
git why
```

---

Your AI coding assistant just rewrote your authentication middleware. The code works. The tests pass. The PR is open.

But *why* does the code look like this? What tradeoffs were considered? What alternatives were rejected? What was the AI uncertain about? What constraints from the rest of the codebase shaped the result?

That reasoning existed — for about forty-five seconds, inside a context window that no longer exists.

**Whytho** is an open standard that captures AI reasoning, decisions, and code understanding as structured, versioned artifacts inside your git repository. It defines a `.why/` folder, a four-level annotation system, a commit-time resolution protocol, and a relationship graph that makes codebases navigable for both humans and AI agents.

The reasoning becomes part of the repo. It gets versioned, diffed, searched, and reviewed alongside the code it describes.

---

## The Problems

### AI reasoning evaporates

Every AI coding session produces reasoning — the objectives, decisions, tradeoffs, rejected alternatives, and uncertainty flags that explain why code looks the way it does. All of it vanishes when the session ends. Whytho makes that reasoning a permanent, versioned artifact of the repository.

### Code review is missing half the picture

Reviewers of AI-assisted PRs see *what* changed but not *why*. Whytho gives reviewers — both human and AI — the full decision context: what was considered, what was rejected, what the AI was confident about, and what it flagged as uncertain.

### AI agents start from scratch every time

Planning and coding agents rediscover codebase intent on every task. Whytho gives them a navigable map: folder-level architectural decisions, file-level purpose statements, block-level tradeoff documentation, and relationship annotations that say which functions are preferred over similar ones, which patterns are legacy versus current, and what constraints exist globally and locally.

### Comments rot silently

Human comments go stale and nobody notices until the comment is actively misleading. Whytho enforces annotation freshness structurally — at commit time, not through human discipline. Every commit triggers resolution that detects staleness, updates annotations, or archives them. There is no silent rot.

### Documentation is inconsistent

Human documentation is written by many people in many styles at many levels of detail. AI-generated annotations are consistent in structure, vocabulary, and coverage across the entire codebase.

### Attribution is ambiguous

When something breaks, you need to know whether a decision was made by a human, by an AI, or collaboratively. Whytho tags every decision with its origin, creating an accountability layer that matters for code review, debugging, and regulated environments.

### Audit trails don't exist

Regulated industries require documented reasoning behind code changes. Whytho provides structured, immutable audit history — who decided what, when, and why — with archival that preserves reasoning even after the code it describes has been deleted.

### Code relationships are invisible

When a function changes, the tests that verify it, the configuration that drives it, and the code that extends it should know. Whytho defines a relationship graph with a hook system that makes these connections explicit and actionable.

---

## How It Works

Whytho defines a `.why/` folder at the root of your git repository:

```
.why/
  sessions/         ← one file per AI coding session
  folders/          ← one file per annotated folder
  files/            ← one file per annotated source file
  blocks/           ← one file per annotated code block
  archive/          ← deleted and superseded annotations, never lost
  index.json        ← cross-link graph, metric state, confidence scores
  archive-index.json
```

Annotations are **Markdown with YAML frontmatter** — machine-parseable, human-readable, and GitHub-renderable without any tooling. Index files are JSON.

### Four Levels of Annotation

**Session** — captures the objectives, decisions, and commits of a single AI coding session. Every decision is tagged as `user`, `ai`, or `collaborative`.

**Folder** — captures the purpose of a folder, its role in the architecture, and structural decisions that apply to all files within it. The root folder annotation captures project-wide architectural decisions, canonical patterns, and global constraints.

**File** — captures why a file exists, why it was in scope for a session, and the nature of changes made.

**Block** — captures the purpose of a specific code block, the tradeoffs and alternatives the AI considered, and uncertainty notes flagging things that may be wrong or worth revisiting. Blocks also carry relationship annotations linking them to related blocks elsewhere in the codebase.

### Block Identity

Annotations must stay linked to code through renames, refactors, and rewrites. No single identifier survives all change types, so Whytho tracks five simultaneous identity metrics per block: symbolic reference, line range, content hash, structural position, and a semantic fingerprint (a short natural language description of what the block does). At commit time, an AI resolver evaluates which metrics agree and elects a canonical metric.

### Commit-Time Resolution

A git hook runs resolution on every commit. This guarantees the index is always authoritative. Resolution detects when blocks have been renamed, relocated, split, merged, deleted, or rewritten, and updates or archives annotations accordingly. Annotations that can't be resolved are frozen and flagged for human review.

### Relationships

Block annotations can declare relationships using a controlled vocabulary — `extends`, `overrides`, `depends_on`, `tests`, `configures`, and others. When a relationship target changes, Whytho emits a hook event. Hook consumers decide how to respond: running tests, notifying a human, triggering an agent, or blocking the commit.

### Archival

Nothing is permanently deleted. When code is removed or thoroughly rewritten, its annotations move to `archive/` with metadata recording when, why, and by which session. The archive is searchable — you can trace why a function was deleted and follow the reasoning back to the session goal that motivated it.

---

## Getting Started

### 1. Initialize

Create the `.why/` folder structure in your repository:

```bash
git why init
```

This creates the folder structure, an empty `index.json`, and installs the commit-time resolution hook.

### 2. Annotate

After an AI coding session, generate annotations:

```bash
git why annotate
```

This prompts the AI resolver to examine the current session's changes and produce session, folder, file, and block annotations. Annotations are written as Markdown files in the appropriate `.why/` subdirectories.

### 3. Commit

Commit normally. The resolution hook runs automatically, updating identity metrics, re-electing canonical metrics, resolving relocations and renames, archiving deleted annotations, and rebuilding the index.

```bash
git commit -m "feat: add token rotation to auth middleware"
```

### 4. Query

Ask questions about your codebase:

```bash
git why block src/auth/middleware.ts::rotateTokenIfNeeded
git why file src/auth/middleware.ts
git why folder src/auth/
git why session 2025-06-14-auth-refactor
git why related src/auth/middleware.ts::rotateTokenIfNeeded
git why history src/auth/middleware.ts::rotateTokenIfNeeded
```

### 5. Review

During code review, annotations are available alongside the diff:

```bash
git why diff main..feature-branch
```

This shows the standard diff annotated with decision context, tradeoff documentation, and uncertainty flags from the `.why/` folder.

---

## Specification

For the full technical specification — including complete schemas, the resolution protocol, the relationship vocabulary, the hook event contract, and implementation guidance — see **[SPEC.md](SPEC.md)**.

---

## Design Principles

**Annotations are artifacts, not metadata.** They live in the repository, are versioned by git, appear in diffs, and are reviewed alongside code.

**Freshness is structural, not aspirational.** The commit-time hook guarantees that annotations are either current or explicitly flagged as stale. There is no silent drift.

**Nothing is deleted.** Annotations move to the archive, never to oblivion. The reasoning behind deleted code is as valuable as the reasoning behind current code.

**Multiple identity metrics, not one.** No single identifier survives all change types. Whytho tracks five simultaneously and elects a canonical metric based on which agree.

**The standard defines contracts, not implementations.** Whytho specifies file formats, schemas, resolution outcomes, and hook events. It does not mandate a specific AI model, editor integration, or CI pipeline.

---

## FAQ

**Does this bloat my repository?**
Annotations are small Markdown files. A typical block annotation is 30–80 lines. The index is a single JSON file. For most projects, the `.why/` folder will be a fraction of the size of `node_modules`.

**Does every commit need annotations?**
No. Annotations are generated during AI-assisted coding sessions. Commits made without AI assistance don't produce new annotations, though the resolution hook still runs to detect whether existing annotations need updating.

**Can I use this with any AI assistant?**
Whytho is model-agnostic. Any AI assistant that can read and write Markdown with YAML frontmatter can produce Whytho-compliant annotations. The specification defines the format, not the producer.

**What if resolution gets it wrong?**
The resolution protocol includes confidence scores on every metric. When confidence drops below a configurable threshold, the annotation is flagged as `UNRESOLVABLE` and frozen for human review rather than silently degrading.

**Can I `.gitignore` the `.why/` folder?**
You can, but you'd be defeating the purpose. The value of Whytho is that reasoning is versioned alongside code. If your team doesn't want annotations in the main repo, consider keeping `.why/` on a dedicated branch.

---

## License

Whytho is an open standard. The specification is released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Implementations may use any license.
