# whytho — Claude Code Instructions

## What this project is

`whytho` is an npm package that implements the Whytho v1.0 spec: persisting AI reasoning alongside git repositories via a `.why/` folder. It exposes a `git-why` CLI binary (enabling `git why <cmd>` as a git subcommand) and a programmatic TypeScript library.

@AGENT_INSTRUCTIONS.md

Or run `/whytho` to load context for the current task interactively.

## Build & test

```bash
npm run build      # tsup — dual CJS/ESM output + .d.ts
npm test           # vitest — 310 unit tests
npm run typecheck  # tsc --noEmit
```

After making changes, always run `npm run build` to catch type errors before committing.

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
    reannotate/     # staleness detection, AI-powered body regeneration
    push/           # agent push API (no AI needed)
    index-builder/  # index.json builder
    archive/        # archiver + query
    relationships/  # graph traversal, hook events
    git/            # repo root, diff, hook installer
  ai/               # AIProvider interface, Anthropic + null providers
  config/           # WhythoConfig loader + defaults
tests/
  fixtures/         # sample.ts for parser tests
  unit/             # unit tests
```

## Key files

- [SPEC.md](SPEC.md) — the full Whytho v1.0 specification. This is the source of truth.
- [src/core/types.ts](src/core/types.ts) — all TypeScript types + Zod schemas
- [src/core/constants.ts](src/core/constants.ts) — all string constants
- [src/core/identity/election.ts](src/core/identity/election.ts) — 5-rule canonical metric election protocol
- [src/core/resolution/pipeline.ts](src/core/resolution/pipeline.ts) — resolution orchestrator
- [src/core/push/index.ts](src/core/push/index.ts) — agent push API
- [src/core/reannotate/index.ts](src/core/reannotate/index.ts) — staleness detection + reannotation engine

## Committing changes

After the user approves any changes you have made, commit them immediately using `git commit`. Stage only the relevant source files — do not stage `dist/` unless it was already tracked. The post-commit hook will automatically run resolution and commit any `.why/` updates as a follow-up `[whytho] resolve annotations` commit.

## Conventions

- Atomic writes: always use `writeFile` from `src/core/fs/writer.ts` (write-to-tmp-then-rename)
- No AI needed for push: `git why push` writes annotations directly, bypassing AI inference
- Tests live in `tests/unit/` — add a test for any new pure function
- The CLI binary is `git-why`; `git why` works because git discovers `git-<subcommand>` on PATH
