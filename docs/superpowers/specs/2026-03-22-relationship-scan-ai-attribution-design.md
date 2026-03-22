# Design: Relationship Scan — AI Attribution & Type Cleanup

**Date:** 2026-03-22
**Status:** Approved

## Summary

Simplify the relationship type system down to the four types that have clear, statically-derivable meaning. Fix the static scanner's attribution granularity by moving file-level edges to file annotations. Add an AI scan mode to `git why scan` that attributes those file-level edges to their correct source blocks.

---

## Section 1 — Relationship Type Cleanup

Remove five relationship types from `RELATIONSHIP_TYPES` in `src/core/constants.ts`:

- `validates`
- `documents`
- `configures`
- `derived_from`
- `overrides`

**Retained types:** `depends_on`, `tests`, `extends`, `implements`

**Rationale:** The removed types require semantic interpretation that is too ambiguous to produce reliably (agent or AI). The four retained types are grounded in syntactic facts — imports, inheritance, interface implementation — and have a clear static/AI attribution split.

**Migration:** No migration required. Existing block annotations with removed relationship types are left as-is (harmless stale data). `parseAnnotation` performs no Zod validation — it is a plain gray-matter parse with a cast — so stale relationship types are safely ignored at read time. The static scanner clears its own `source: 'static'` edges on re-scan; removed types only exist as `source: 'ai'` edges written by agents.

**Test fixture update:** `tests/unit/scanner-core.test.ts` uses `type: 'validates'` in two fixtures — line 58 and line 124. Both must be updated to a retained type (e.g. `depends_on`).

---

## Section 2 — Static Scanner: File-Level Attribution

### Problem

All four scanner plugins (`typescript`, `python`, `go`, `rust`) attribute `depends_on` and `tests` edges to `defaultSourceBlock` — the first block found in the file. This is imprecise: a file with 10 functions records all its import dependencies against whichever function happens to be first.

`extends` and `implements` are already correctly attributed at block level (e.g. `src/foo.ts::MyClass`) and are not changed.

### Solution

Move `depends_on` and `tests` edges to **file annotations** instead of block annotations.

### Interface changes

Split `ScannedRelationship` into two discriminated interfaces to avoid the name collision between `sourceBlock` (the block ref) and `source` (the pipeline provenance field):

```ts
// Replaces the single ScannedRelationship interface
export interface FileLevelEdge {
  sourceFile: string          // repo-relative file path, e.g. "src/foo.ts"
  type: 'depends_on' | 'tests'
  target: string              // symbolic ref of the target block
  source: 'static'
}

export interface BlockLevelEdge {
  sourceBlock: string         // symbolic ref, e.g. "src/foo.ts::MyClass"
  type: RelationshipType
  target: string
  source: 'static'
}

export type ScannedRelationship = FileLevelEdge | BlockLevelEdge
```

Discriminant: presence of `sourceFile` vs `sourceBlock`.

### `FileFrontmatter` change

Add an optional `relationships` field (same schema as `BlockFrontmatter.relationships`):

```ts
relationships?: Array<{
  type: RelationshipType
  target: string
  source?: 'static' | 'ai'
}>
```

The `FileFrontmatterSchema` Zod schema must be updated in parallel.

### Scanner plugin changes

Remove the `defaultSourceBlock` helper from all four plugins. Plugins return `FileLevelEdge` for `depends_on`/`tests` (with `sourceFile` set to the file path) and `BlockLevelEdge` for `extends`/`implements`.

Per-plugin notes:

- **TypeScript**: `extends` and `implements` edges use `classRef` (the class's own symbolic ref) and do not reference `defaultSourceBlock`. Removal is safe.
- **Python**: Same — `extends` uses `classRef`. Removal is safe.
- **Go**: All edges are `depends_on`/`tests`. The `srcBlock` variable is no longer needed; remove entirely.
- **Rust**: `impl Trait for Type` currently falls back to `srcBlock` when the implementing type is not in the registry (line 128). After removing `defaultSourceBlock`, this fallback is dropped: if the type is not in the registry, skip the `implements` edge. This is preferable to using a file-path ref as a block source, which would be semantically incorrect.

### `runStaticScan` write-back

The current `runStaticScan` uses a single `edgesByBlock: Map<string, ScannedRelationship[]>` accumulator (line 106 of `scanner.ts`). This must be split into two typed accumulators:

```ts
const edgesByBlock = new Map<string, BlockLevelEdge[]>()  // keyed by sourceBlock
const edgesByFile  = new Map<string, FileLevelEdge[]>()   // keyed by sourceFile
```

`runStaticScan` dispatches each returned edge using the discriminant property to populate the correct accumulator:

```ts
if ('sourceFile' in edge) {
  // FileLevelEdge → accumulate in edgesByFile
} else {
  // BlockLevelEdge → accumulate in edgesByBlock
}
```

The existing Pass 3 stale-clearing logic iterates `edgesByBlock` only (unchanged). File-level stale edges are handled by replace-not-merge in Pass 2 (see below) — no separate stale-clearing pass for file edges.

Two separate write-back paths:

- **`FileLevelEdge`**: Written to the file annotation's `relationships` array. The file annotation is created if absent. On each rescan of a file, the file annotation's `source: 'static'` relationships are **replaced wholesale** (not appended), so removing an import correctly clears the corresponding edge.
- **`BlockLevelEdge`**: Written to block annotations (existing behavior, unchanged).

**Stale-clearing:** The existing block stale-clearing pass (lines 156–179 of `scanner.ts`) continues unchanged for block-level edges. File-level stale edges are handled by the replace-not-merge write-back above — no separate stale-clearing pass is needed.

### `pushReasoning` file branch update

`src/core/push/index.ts`'s `file` branch (line ~199) currently has no relationship merge logic. Add relationship merging to match the `block` branch: deduplicate by `target + type`, preserve `source: 'ai'` edges, merge new entries.

Note: `runStaticScan` and the AI scan orchestrator write file-level and block-level relationships directly (not via `pushReasoning`). The `pushReasoning` file branch update is to support agents who push relationships explicitly via `git why push file`. No new `PushInput` API surface is required — the `relationships` field already exists on `PushInput`.

### Index builder changes

File-level relationship edges are exposed via a new `relationships_out` field on `FileIndexEntry` (analogous to `BlockIndexEntry.relationships_out`). This is the lowest-risk path — it avoids modifying `WhythoIndex.relationships` (which uses symbolic block refs as `source` and would break if a file path was used there).

```ts
// Addition to FileIndexEntry in WhythoIndex
relationships_out?: Array<{ type: RelationshipType; target: string; pipeline?: 'static' | 'ai' }>
```

`build.ts` populates this from `FileFrontmatter.relationships` during index build.

---

## Section 3 — AI Scan: Block-Level Attribution

### Goal

The static scanner knows *what* a file imports but not *which block* does the importing. The AI scan's job is to take the file-level static edges and attribute each one to the correct block(s) within the file.

### Trigger

The scan command reads `config.relationships.ai_scan`:

- `'off'` (default) — AI scan never runs from `git why scan`
- `'manual'` — AI scan runs when `git why scan` is invoked
- `'on_commit'` — AI scan runs inside `git why resolve` (post-commit), right after `runStaticScan`

A `--ai` CLI flag on `git why scan` triggers the AI scan for that invocation regardless of config value (useful for one-off runs when `ai_scan: 'off'`). A `--static-only` flag skips the AI scan even if config enables it.

**`--ai` + `static_scan: false` interaction:** The current early-exit guard in `scan.ts` (`if (config.relationships?.static_scan === false) process.exit(0)`) applies only to the static scan path. When `--ai` is passed, the command must bypass this guard and proceed directly to AI scan. The implementation must restructure the guard accordingly (gate it on "no scan mode is active" rather than "static scan is off").

**`--file` + `--ai` interaction:** The `--file` flag scopes the static scan to a single file. It does **not** scope the AI scan — AI scan always processes all qualifying files in the repo regardless of `--file`. The CLI output should make this clear when both flags are used together.

### Scope

Only files that have a file annotation with at least one `source: 'static'` relationship edge. Files without file-level static edges produce nothing for the AI to attribute.

### Per-File Prompt

One AI call per qualifying file. Input:

1. Full file source
2. Parsed block list for that file (name + kind for each block)
3. The static edge targets from the file annotation (the symbolic refs already found)

The prompt asks: *"For each block in this file, which of these known targets does it directly depend on or test? Only use the exact symbolic refs provided."*

Response format: a structured list of `{block, type, target}` triples. Both `type` and `target` are constrained to values already known (no hallucination surface for targets; type is one of `depends_on` | `tests`). Any triple returned by the AI with a target not in the static set is silently discarded.

### Output

Written to block annotations as `source: 'ai'` edges, using the existing relationship merge logic in `pushReasoning`'s block branch (deduplication by `target + type` already handled there).

The file-level static edges are **kept** — they represent file-level provenance. Block-level AI edges are additive, more granular attribution.

### AI Provider

Uses `getInferProvider(config)` with sequential calls via `generateAnnotation` (using the `customPrompt` field on `AnnotationRequest.context`). This is the same path as `git why infer`'s non-batch mode. Batch mode support is deferred — the initial implementation is sequential only. Batch mode can be added in a follow-up once the prompt/response format is validated.

### Result type

Define a new `AIScanResult` interface in `ai-attribution.ts`:

```ts
export interface AIScanResult {
  filesProcessed: number
  relationshipsFound: number    // triples returned by AI
  relationshipsWritten: number  // triples successfully written to block annotations
  relationshipsSkipped: number  // triples discarded (target not in static set, or block annotation absent)
}
```

### `on_commit` Integration

When `ai_scan: 'on_commit'`, the AI scan runs inside `src/cli/commands/resolve.ts` immediately after the `runStaticScan` call (line 52). No hook script changes required. Users who opt into `on_commit` accept that `git commit` will incur an API call. The scan self-limits to files with file-level static edges, so unrelated commits (no import changes) produce no API calls.

### Summary Output

The scan command output gains two lines when AI scan runs:

```
  AI relationships found:   12
  AI relationships written: 9
  AI relationships skipped: 3  (target not in block registry)
```

### Test strategy for `ai-attribution.test.ts`

Tests use a stub `AIProvider` that returns fixture responses (same pattern as the null provider in `src/ai/providers/null.ts`). Must cover at minimum:

- Correct block attribution when AI returns valid `{block, type, target}` triples
- Graceful handling of AI returning a target not in the static set (silently skipped, counted in `relationshipsSkipped`)
- Graceful handling of AI returning an empty or malformed response (no writes, no crash)
- `AIScanResult` counters are accurate across all cases

---

## Section 4 — Config

No type changes to `WhythoConfig` — `relationships.ai_scan` is already defined. Default remains `'off'`.

```jsonc
// whytho.config.json
{
  "relationships": {
    "static_scan": true,       // run static scan on commit (default: true)
    "ai_scan": "manual"        // 'off' | 'manual' | 'on_commit'
  }
}
```

---

## Affected Files

| File | Change |
|---|---|
| `src/core/constants.ts` | Remove 5 relationship types |
| `src/core/types.ts` | Add `relationships` to `FileFrontmatter` + schema; add `relationships_out` to `FileIndexEntry`; split `ScannedRelationship` into `FileLevelEdge` + `BlockLevelEdge` |
| `src/core/relationships/scanner.ts` | Two-path write-back (file + block); replace-not-merge for file-level static edges; export new interfaces |
| `src/core/relationships/scanner-plugins/typescript.ts` | Remove `defaultSourceBlock`; return `FileLevelEdge` for `depends_on`/`tests` |
| `src/core/relationships/scanner-plugins/python.ts` | Remove `defaultSourceBlock`; return `FileLevelEdge` for `depends_on`/`tests` |
| `src/core/relationships/scanner-plugins/go.ts` | Remove `defaultSourceBlock`; return `FileLevelEdge` for `depends_on`/`tests` |
| `src/core/relationships/scanner-plugins/rust.ts` | Remove `defaultSourceBlock`; return `FileLevelEdge` for `depends_on`/`tests` |
| `src/core/push/index.ts` | Add relationship merge logic to the `file` branch (mirrors `block` branch) |
| `src/core/index-builder/build.ts` | Populate `FileIndexEntry.relationships_out` from `FileFrontmatter.relationships` |
| `src/core/relationships/` (new file) | `ai-attribution.ts` — AI scan orchestrator; defines `AIScanResult` |
| `src/ai/prompts/` (new file) | `relationship-attribution.ts` — prompt builder + response parser |
| `src/cli/commands/scan.ts` | Add `--ai`, `--static-only` flags; restructure `static_scan: false` guard; call AI scan |
| `src/cli/commands/resolve.ts` | Call AI scan when `ai_scan: 'on_commit'` |
| `tests/unit/scanner-core.test.ts` | Update file-level attribution; fix `validates` fixture (line 58) |
| `tests/unit/` (new file) | `ai-attribution.test.ts` — stub AI provider, covers attribution, hallucination guard, empty response |

---

## Open Questions / Non-Goals

- **AI scan does not run on blocks with no file-level edges** — same-file block-to-block relationships are out of scope for this iteration.
- **`--file` does not scope AI scan** — when `--file src/foo.ts --ai` is used, static scan is scoped to `src/foo.ts` but AI scan processes all qualifying files. The CLI output communicates this explicitly.
- **No removal of file-level edges after AI attribution** — they coexist and serve different audiences (file-level for quick overview, block-level for precise navigation).
- **Batch mode for AI scan is deferred** — initial implementation is sequential only.
- **`WhythoIndex.relationships` does not include file-level edges** — the flat `RelationshipEdge[]` array in `WhythoIndex` is populated only from block annotations. File-level `depends_on`/`tests` edges are accessible via `FileIndexEntry.relationships_out` but will not appear in `WhythoIndex.relationships`. Consumers querying `WhythoIndex.relationships` for `depends_on` edges will see an incomplete picture until block-level AI attribution has run.
