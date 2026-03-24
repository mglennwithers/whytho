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

A git hook runs resolution on every commit. This guarantees the index is always authoritative. Resolution detects when blocks have been renamed, relocated, split, merged, deleted, or rewritten, and updates or archives annotations accordingly. Annotations that can't be resolved are frozen and flagged for human review. Any changes the hook makes are automatically committed as a follow-up `[whytho] resolve annotations` commit.

### Relationships

Block annotations can declare relationships using a controlled vocabulary — `extends`, `depends_on`, `implements`, and `tests`. When a relationship target changes, Whytho emits a hook event. Hook consumers decide how to respond: running tests, notifying a human, triggering an agent, or blocking the commit.

### Archival

Nothing is permanently deleted. When code is removed or thoroughly rewritten, its annotations move to `archive/` with metadata recording when, why, and by which session. The archive is searchable — you can trace why a function was deleted and follow the reasoning back to the session goal that motivated it.

---

## Installation

```bash
npm install -g whytho
```

Requires Node.js 18+. Set your `ANTHROPIC_API_KEY` environment variable to enable AI-powered annotation generation. To use OpenAI or Gemini instead, see [AI Provider Configuration](#ai-provider-configuration).

---

## AI Assistant Setup

Whytho works with any AI assistant. The base integration is a context file that tells your assistant to consult `.why/` before modifying code. Claude Code additionally supports an MCP server that exposes all whytho query tools directly in the conversation, and a lifecycle hook that automatically injects annotation context whenever Claude reads a source file.

> **Lifecycle hooks are only available in Claude Code.** Cursor and Copilot do not have an equivalent hook system for injecting context in response to tool events. For those tools, context is injected statically at the start of each conversation.

### Claude Code

**1. Register the MCP server**

Add whytho to your MCP configuration. For a project-level setup, create `.mcp.json` at the repo root:

```json
{
  "mcpServers": {
    "whytho": {
      "type": "stdio",
      "command": "git",
      "args": ["why", "mcp"]
    }
  }
}
```

This gives Claude Code access to all whytho query tools — `get_file_context`, `get_block`, `search`, `push_note`, and more — directly from the conversation.

**2. Add a CLAUDE.md**

Create a `CLAUDE.md` at the repo root to tell Claude Code to read annotations before exploring or modifying files:

```markdown
## Whytho annotations

Before exploring or modifying any file, read its whytho annotations first.
The `.why/` folder contains captured reasoning — design decisions, rejected
alternatives, tradeoffs, and constraints that aren't visible in the source code.

- Use `mcp__whytho__get_summary()` when starting a new task
- Use `mcp__whytho__get_file_context("path/to/file.ts")` before modifying a file
- Use `mcp__whytho__search("query")` to find reasoning on a topic
- Use `mcp__whytho__push_note({ ref, body })` to record decisions as you work
```

**3. Install the lifecycle hook** *(optional)*

Claude Code supports PostToolUse hooks — shell scripts that run after a tool is used and can inject additional context into the conversation. The whytho hook automatically appends file and block annotation context whenever Claude reads a source file, so the relevant `.why/` reasoning is always in context without needing to ask for it explicitly.

An example hook script is included at [`.claude/hooks/read-annotations.sh`](.claude/hooks/read-annotations.sh). Register it in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/read-annotations.sh"
          }
        ]
      }
    ]
  }
}
```

---

### Cursor

**1. Register the MCP server**

Cursor supports MCP. Add whytho to `.cursor/mcp.json` in the project (or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "whytho": {
      "command": "git",
      "args": ["why", "mcp"]
    }
  }
}
```

**2. Add a cursor rule**

Create `.cursor/rules/whytho.mdc` to inject annotation guidance when source files are open:

```markdown
---
description: Read whytho annotations before modifying source files
globs: ["src/**/*"]
alwaysApply: false
---

Before modifying any file, read its whytho annotation first using the whytho
MCP tools:
- `whytho_get_file_context` with the file path for full context
- `whytho_search` to find reasoning on a topic
- `whytho_push_note` to record decisions as you work

Annotations in `.why/` contain design decisions, rejected alternatives, and
constraints that are not visible in the source code.
```

The `globs` field scopes the rule to source files so it only activates when a relevant file is open. Unlike Claude Code, Cursor does not support lifecycle hooks — this rule is injected statically rather than in response to a file-read event.

---

### GitHub Copilot

GitHub Copilot does not support MCP servers or lifecycle hooks. Add a static instruction file at `.github/copilot-instructions.md`:

```markdown
## Whytho annotations

This repo uses whytho to capture AI reasoning alongside source code. Annotations
live in `.why/` and contain design decisions, rejected alternatives, and constraints
that are not visible in the code itself.

Before modifying any file, check for its annotation:
- Run `git why file <path>` in the terminal, e.g. `git why file src/auth/middleware.ts`
- Run `git why block <ref>` for a specific function, e.g. `git why block src/auth/middleware.ts::rotateToken`

To record a decision as you work:
  git why push block src/file.ts::functionName --body "your reasoning here"
```

Because Copilot has no MCP integration or hook system, it cannot query annotations dynamically. Direct it to run `git why` commands in the terminal, or paste the relevant annotation body into the conversation.

---

## AI Provider Configuration

By default, whytho uses Anthropic (Claude). To use a different provider, set `aiProvider` in `.why/config.yml`:

**OpenAI:**
```yaml
aiProvider: openai
openai:
  annotationModel: gpt-4o
  inferModel: gpt-4o-mini
  apiKeyEnv: OPENAI_API_KEY
```

**Google Gemini:**
```yaml
aiProvider: gemini
gemini:
  annotationModel: gemini-2.0-flash
  inferModel: gemini-2.0-flash
  apiKeyEnv: GEMINI_API_KEY
```

Install the corresponding SDK alongside whytho:

```bash
npm install -g openai          # for OpenAI
npm install -g @google/genai   # for Gemini
```

---

## Getting Started

### 1. Initialize

```bash
git why init
```

Creates the `.why/` folder structure, an empty `index.json`, and installs the commit-time resolution hook.

### 2. Capture reasoning during a session

The best annotations come from the AI recording its reasoning *as it works*, before context is lost or compacted. Use `git why push` to write reasoning directly — no AI inference required:

```bash
# Annotate a specific block
git why push block src/auth/middleware.ts::rotateTokenIfNeeded \
  --body "Rotates the token on every request rather than on expiry because
the threat model assumes token theft, not expiry. Stateless rotation
means no DB lookup per request — the tradeoff is a 5-minute window
where a stolen token remains valid after rotation."

# Add a note to the current session
git why push session --body "Decided against Redis for session state — adds
operational complexity and the throughput requirements don't justify it."

# Pipe multi-line reasoning from stdin
cat <<'EOF' | git why push file src/auth/middleware.ts
Central auth layer. All requests pass through here. Changes here
affect the entire API surface — treat as high-risk.
EOF
```

### 3. Generate AI annotations after a session

After an AI coding session, generate structured annotations for all changed files:

```bash
git why annotate
```

This uses the AI to produce session, folder, file, and block annotations for everything touched in the current commit.

### 4. Backfill unannotated code

For codebases with existing code that has no annotations, `git why infer` generates post-hoc reasoning from static analysis. Each inferred annotation is clearly marked with a confidence score so readers know it wasn't captured from the original session:

```bash
git why infer --dry-run        # preview what's missing
git why infer                  # generate up to 500 annotations
git why infer src/auth/        # limit to a subtree
git why infer --limit 50       # smaller batch
```

Inferred annotations include:
- `inferred: true` in the frontmatter
- `inference_confidence: 0.82` (model's self-assessed confidence)
- A disclaimer blockquote at the top of the body
- A "What Cannot Be Determined" section listing what the model couldn't infer from code alone

### 5. Commit

Commit normally. The resolution hook runs automatically, updating identity metrics, re-electing canonical metrics, resolving relocations and renames, archiving deleted annotations, and rebuilding the index. Any annotation updates are committed automatically as `[whytho] resolve annotations`.

```bash
git commit -m "feat: add token rotation to auth middleware"
```

### 6. Query

```bash
git why block src/auth/middleware.ts::rotateTokenIfNeeded
git why file src/auth/middleware.ts
git why folder src/auth/
git why session 2025-06-14-auth-refactor
git why related src/auth/middleware.ts::rotateTokenIfNeeded
git why history src/auth/middleware.ts::rotateTokenIfNeeded
```

### 7. Review

During code review, annotations are available alongside the diff:

```bash
git why diff main..feature-branch
```

---

## CLI Reference

| Command | Description |
|---|---|
| `git why init` | Initialize `.why/` and install the git hook |
| `git why status` | Show annotation counts, health, and optionally coverage |
| `git why annotate` | Generate AI annotations for the current session's changed files |
| `git why push <type> <ref> --body "..."` | Push reasoning directly into an annotation (no AI needed) |
| `git why infer [path]` | Generate inferred annotations for unannotated blocks/files/folders |
| `git why resolve` | Run resolution manually |
| `git why block <ref>` | Show a block annotation |
| `git why file <path>` | Show a file annotation |
| `git why folder <path>` | Show a folder annotation |
| `git why session <id>` | Show a session annotation |
| `git why related <ref>` | Show the relationship graph for a block |
| `git why history <ref>` | Show live and archived versions of a block annotation |
| `git why diff <range>` | Show a git diff annotated with decision context |
| `git why scan` | Run static relationship scanner across the repo (or a single file) |
| `git why search <query>` | Search annotations by text or `--semantic` AI-powered meaning |
| `git why mcp` | Start the MCP server (stdio transport) for use with Claude Code and other MCP clients |

---

## Specification

For the full technical specification — including complete schemas, the resolution protocol, the relationship vocabulary, the hook event contract, and implementation guidance — see **[SPEC.md](SPEC.md)**.

---

## Design Principles

**Annotations are artifacts, not metadata.** They live in the repository, are versioned by git, appear in diffs, and are reviewed alongside code.

**Freshness is structural, not aspirational.** The commit-time hook guarantees that annotations are either current or explicitly flagged as stale. There is no silent drift.

**Nothing is deleted.** Annotations move to the archive, never to oblivion. The reasoning behind deleted code is as valuable as the reasoning behind current code.

**Multiple identity metrics, not one.** No single identifier survives all change types. Whytho tracks five simultaneously and elects a canonical metric based on which agree.

**First-hand reasoning beats inference.** `git why push` lets agents write reasoning at the moment of decision. Inferred annotations are always marked as such. The system is honest about the difference.

**The standard defines contracts, not implementations.** Whytho specifies file formats, schemas, resolution outcomes, and hook events. It does not mandate a specific AI model, editor integration, or CI pipeline.

---

## FAQ

**Does this bloat my repository?**
Annotations are small Markdown files. A typical block annotation is 30–80 lines. The index is a single JSON file. For most projects, the `.why/` folder will be a fraction of the size of `node_modules`.

**Does every commit need annotations?**
No. Annotations are generated during AI-assisted coding sessions. Commits made without AI assistance don't produce new annotations, though the resolution hook still runs to detect whether existing annotations need updating.

**Can I use this with any AI assistant?**
Yes. Whytho is model-agnostic — the default uses Claude, but OpenAI and Gemini are also supported out of the box (see [AI Provider Configuration](#ai-provider-configuration)). Any assistant that can read and write Markdown with YAML frontmatter can produce Whytho-compliant annotations. The specification defines the format, not the producer.

**What if resolution gets it wrong?**
The resolution protocol includes confidence scores on every metric. When confidence drops below a configurable threshold, the annotation is flagged as `UNRESOLVABLE` and frozen for human review rather than silently degrading.

**What's the difference between `git why annotate` and `git why push`?**
`git why annotate` uses AI to *infer* reasoning by analyzing the code diff after the fact. `git why push` lets an AI agent write reasoning *directly* at the moment of decision — no inference, no compaction loss. Push annotations are more accurate; annotate is a useful fallback when push wasn't used during the session.

**What's the difference between `git why annotate` and `git why infer`?**
`git why annotate` generates annotations for files changed in the current commit. `git why infer` walks the entire source tree and generates annotations for anything that has none — useful for backfilling existing codebases.

**Can I `.gitignore` the `.why/` folder?**
You can, but you'd be defeating the purpose. The value of Whytho is that reasoning is versioned alongside code. If your team doesn't want annotations in the main repo, consider keeping `.why/` on a dedicated branch.

---

## License

MIT
