# whytho — Project TODO

## Fixes

- [x] **Coverage cache uses raw `fs.writeFile`** — `src/cli/commands/status.ts` writes `coverage-cache.json` via `fs.writeFile` instead of the atomic writer from `src/core/fs/writer.ts`. A crash mid-write could corrupt the cache.
- [x] **`export` command uses raw `fs.writeFile`** — `src/cli/commands/export.ts` (`--out` path) also bypasses the atomic writer convention.
- [x] **Duplicated provider dispatch in `src/ai/registry.ts`** — `getInferProvider`, `getScanProvider`, and `getDefaultProvider` each repeat the same 3-provider dispatch pattern (~60 lines each). Extract a shared helper to eliminate the duplication.
- [x] **`git why diff` annotations appear after the file block, not inline** — Annotation flush happens at file boundary, so annotations appear below the file's diff lines rather than interleaved at the changed lines. Fix to show annotations adjacent to the relevant hunk.
- [x] **Sessions show 0 files in summary** — All 3 recent sessions report 0 `files_touched` / `blocks_touched`. Investigate whether session tracking is regressed or sessions are simply not being populated by recent work.
- [x] **`git why pr` section extraction is fragile** — `extractSections` in `src/cli/commands/pr.ts` does substring heading matching. If session bodies don't use `### Objectives` / `### Decisions` / `### Uncertainty` headings, the PR output will be empty. Verify the session annotation prompt produces these headings, or make extraction more resilient.

## Could Be Better

- [x] **No integration tests** — All tests are unit tests. Add end-to-end tests covering at least `init → push → resolve → query` to catch wiring regressions.
- [x] **No progress output for long operations** — `infer` and `resolve` are silent on large repos. Add a simple "Processing N blocks..." counter.
- [x] **Java relationship scanner** — Parser plugin exists but no `src/core/relationships/scanner-plugins/java.ts`. Should detect `import` statements and method call relationships.
- [x] **C# relationship scanner** — Parser plugin exists but no `src/core/relationships/scanner-plugins/csharp.ts`. Should detect `using` directives and method call relationships.
