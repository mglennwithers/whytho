# Whytho — Agent Instructions

The `.why/` folder contains AI reasoning annotations — design decisions, rejected alternatives, tradeoffs, and constraints not visible in source code.

## Read annotations before planning

Before exploring or modifying any file, read its annotations first.

**CLI:** `git why file <path>` · `git why block <file>::<blockName>` · `git why search <query>`

**MCP (Claude Code):**

| Scenario | Tool |
|---|---|
| Starting a new task | `mcp__whytho__get_summary()` |
| Exploring files | `mcp__whytho__get_file_context(path, { purpose_only: true })` |
| Before modifying a file | `mcp__whytho__get_file_context("path/to/file.ts")` |
| Before changing a function | `mcp__whytho__get_block("file.ts::functionName")` |
| Searching for reasoning | `mcp__whytho__search("query")` |
| Multiple blocks/files | `mcp__whytho__get_annotations({ refs: [...] })` |
| What depends on a block | `mcp__whytho__get_related("file.ts::blockName")` |

## Push reasoning as you work

When you make a non-obvious decision, push a note immediately — before context is lost or the session is compacted.

```bash
git why push block <file>::<blockName> --body "reasoning"
git why push session --body "reasoning"
git why push file <path> --body "reasoning"
```

Push when you:
- Choose one approach over another (explain why the alternative was rejected)
- Pick a threshold, timeout, or numeric constant
- Write something that will look surprising or wrong to a future reader
- Make a decision driven by a spec or constraint
- Handle a tricky edge case

Only push where the code itself doesn't explain the *why*.

## Reannotate after modifying code

After changing annotated code, check if the annotation is still accurate.

**Reannotate when:** function behavior/signature/logic changed · parameters added or removed · file refactored significantly · code moved between files

```bash
git why reannotate --block "src/path/to/file.ts::functionName"
git why reannotate --file src/path/to/file.ts
git why reannotate --incremental
```

Prefer `git why push` for minor corrections; use `reannotate` when the body is substantially wrong. Skip if you only changed whitespace/comments, wrote the annotation yourself this session, or the block has no annotation.
