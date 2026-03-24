# whytho — Claude Code Instructions

## What this project is

`whytho` is an npm package that implements the Whytho v1.0 spec: persisting AI reasoning alongside git repositories via a `.why/` folder. It exposes a `git-why` CLI binary (enabling `git why <cmd>` as a git subcommand) and a programmatic TypeScript library.

## Read annotations before planning

**Before exploring or modifying any file in this repo, read its whytho annotations first.** The `.why/` folder contains captured reasoning that isn't visible in source code — design decisions, rejected alternatives, tradeoffs, and constraints that shaped the current implementation.

Match annotation depth to task depth:

| Scenario | Tool to use |
|---|---|
| Starting a new task — understand what's annotated | `mcp__whytho__get_summary()` |
| Exploring multiple files to find the right one | `mcp__whytho__get_file_context(path, { purpose_only: true })` |
| About to modify a file — need full context | `mcp__whytho__get_file_context(path)` (default, includes blocks) |
| About to change a specific function | `mcp__whytho__get_block("file.ts::functionName")` |
| Only need tradeoffs or uncertainty for a block | `mcp__whytho__get_block(ref, { include: ["Tradeoffs"] })` |
| Need context for several blocks/files at once | `mcp__whytho__get_annotations({ refs: [{ type, ref }, ...] })` |
| Looking for reasoning on a topic across the codebase | `mcp__whytho__search("query")` |
| Need to know what depends on a block | `mcp__whytho__get_related("file.ts::blockName")` |

Or run `/whytho` to load context for the current task interactively.

Skipping this step means planning against incomplete information — design choices that look arbitrary in the source may have explicit reasoning in `.why/` that rules out the approach you're about to take.

## Build & test

```bash
npm run build      # tsup — dual CJS/ESM output + .d.ts
npm test           # vitest — 126 unit tests
npm run typecheck  # tsc --noEmit
```

After making changes, always run `npm run build` to catch type errors before committing.

## Annotate your reasoning as you work

This project uses itself. When you make a non-obvious decision — a design choice, a tradeoff, a "why not the obvious thing" — push a note immediately using the `git why push` command. Do this **before** the context is lost or the session is compacted.

### Push to a block annotation

```bash
git why push block <file>::<blockName> --body "Your reasoning here"
```

Example:
```bash
git why push block src/core/identity/election.ts::electCanonicalMetric \
  --body "Rule order matters: symbolic fires first because name stability is the strongest signal. Content hash is second because identical content = same block regardless of location. Structural is last deterministic fallback."
```

If the block annotation doesn't exist yet, it will be created with full identity metrics derived from the live source file.

### Push to the current session

```bash
git why push session --body "Your reasoning here"
```

This appends a timestamped Agent Note to the most recent session annotation in `.why/sessions/`.

### Push to a file annotation

```bash
git why push file src/path/to/file.ts --body "Your reasoning here"
```

### Multi-line reasoning via stdin

```bash
cat <<'EOF' | git why push block src/core/resolution/pipeline.ts::runResolutionPipeline
Processes only changed files to keep post-commit hooks under 2s.
Full rebuild is available via --full for CI or initial setup.
The incremental filter runs before parsing to avoid loading unrelated files.
EOF
```

## When to push a note

Push a note when you:
- Choose one implementation approach over another (explain why the alternative was rejected)
- Pick a threshold, timeout, or numeric constant (explain the reasoning behind the value)
- Write something that will look surprising or wrong to a future reader
- Make a decision driven by the spec (cite the relevant section)
- Encounter a tricky edge case and decide how to handle it

You don't need to annotate every function — only decisions where the code itself doesn't explain the *why*.

## Project structure

```
src/
  cli/commands/     # CLI subcommands (one file per command)
  core/
    fs/             # .why/ path helpers, atomic writer, reader
    frontmatter/    # gray-matter parse/serialize/validate
    parser/         # AST + regex block parser, plugin registry
    identity/       # content-hash, election protocol
    resolution/     # pipeline, incremental filter, outcomes
    push/           # agent push API (no AI needed)
    index-builder/  # index.json builder
    archive/        # archiver + query
    relationships/  # graph traversal, hook events
    git/            # repo root, diff, hook installer
  ai/               # AIProvider interface, Anthropic + null providers
  config/           # WhythoConfig loader + defaults
tests/
  fixtures/         # sample.ts for parser tests
  unit/             # 126 unit tests
```

## Key files

- [SPEC.md](SPEC.md) — the full Whytho v1.0 specification. This is the source of truth.
- [src/core/types.ts](src/core/types.ts) — all TypeScript types + Zod schemas
- [src/core/constants.ts](src/core/constants.ts) — all string constants
- [src/core/identity/election.ts](src/core/identity/election.ts) — 5-rule canonical metric election protocol
- [src/core/resolution/pipeline.ts](src/core/resolution/pipeline.ts) — resolution orchestrator
- [src/core/push/index.ts](src/core/push/index.ts) — agent push API

## Committing changes

After the user approves any changes you have made, commit them immediately using `git commit`. Stage only the relevant source files — do not stage `dist/` unless it was already tracked. The post-commit hook will automatically run resolution and commit any `.why/` updates as a follow-up `[whytho] resolve annotations` commit.

## Conventions

- Atomic writes: always use `writeFile` from `src/core/fs/writer.ts` (write-to-tmp-then-rename)
- No AI needed for push: `git why push` writes annotations directly, bypassing AI inference
- Tests live in `tests/unit/` — add a test for any new pure function
- The CLI binary is `git-why`; `git why` works because git discovers `git-<subcommand>` on PATH
