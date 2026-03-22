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

**Migration:** No migration required. Existing block annotations with removed relationship types are left as-is (harmless stale data). The static scanner clears its own `source: 'static'` edges on re-scan; removed types only exist as `source: 'ai'` edges written by agents.

---

## Section 2 — Static Scanner: File-Level Attribution

### Problem

All four scanner plugins (`typescript`, `python`, `go`, `rust`) attribute `depends_on` and `tests` edges to `defaultSourceBlock` — the first block found in the file. This is imprecise: a file with 10 functions records all its import dependencies against whichever function happens to be first.

`extends` and `implements` are already correctly attributed at block level (e.g. `src/foo.ts::MyClass`) and are not changed.

### Solution

Move `depends_on` and `tests` edges to **file annotations** instead of block annotations.

**`FileFrontmatter` change:** Add an optional `relationships` field with the same schema as blocks:

```ts
relationships?: Array<{
  type: RelationshipType
  target: string
  source?: 'static' | 'ai'
}>
```

**Scanner changes:**

1. Remove `defaultSourceBlock` helper from all four plugins. Plugins now return edges with `sourceFile` (the file path) instead of `sourceBlock` for `depends_on`/`tests` edges.
2. `ScannedRelationship` interface: rename `sourceBlock` to `source` and add a `level: 'file' | 'block'` discriminant, or split into two interfaces. File-level edges are written to `FileFrontmatter.relationships`; block-level edges (`extends`, `implements`) continue to be written to block annotations.
3. `runStaticScan` write-back: file-level edges are upserted into the file annotation (creating it if absent, updating if present). Stale-clearing pass updated accordingly.

**Index builder:** Update to include file-level `relationships` from `FileFrontmatter` in the index output.

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

### Scope

Only files that have a file annotation with at least one `source: 'static'` relationship edge. Files without file-level static edges produce nothing for the AI to attribute.

### Per-File Prompt

One AI call per qualifying file. Input:

1. Full file source
2. Parsed block list for that file (name + kind for each block)
3. The static edge targets from the file annotation (the symbolic refs already found)

The prompt asks: *"For each block in this file, which of these known targets does it directly depend on or test? Only use the exact symbolic refs provided."*

Response format: a structured list of `{block, type, target}` triples. Both `type` and `target` are constrained to values already known (no hallucination surface for targets; type is one of `depends_on` | `tests`).

### Output

Written to block annotations as `source: 'ai'` edges via `pushReasoning` (deduplication by `target + type` already handled there).

The file-level static edges are **kept** — they represent file-level provenance. Block-level AI edges are additive, more granular attribution.

### AI Provider

Reuses `getInferProvider(config)` — same model and API key path as `git why infer`. Supports batch mode via the existing `config.anthropic.batchInfer` settings.

### `on_commit` Integration

When `ai_scan: 'on_commit'`, the AI scan runs inside `src/cli/commands/resolve.ts` immediately after the `runStaticScan` call (line 52). No hook script changes required. Users who opt into `on_commit` accept that `git commit` will incur an API call. The scan self-limits to files with file-level static edges, so unrelated commits (no import changes) produce no API calls.

### Summary Output

The scan command output gains two lines when AI scan runs:

```
  AI relationships found:   12
  AI relationships written: 9  (3 skipped — blocks not yet annotated)
```

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
| `src/core/types.ts` | Add `relationships` to `FileFrontmatter`; update `ScannedRelationship` |
| `src/core/relationships/scanner.ts` | File-level write-back; updated `ScannedRelationship` interface |
| `src/core/relationships/scanner-plugins/typescript.ts` | Remove `defaultSourceBlock` |
| `src/core/relationships/scanner-plugins/python.ts` | Remove `defaultSourceBlock` |
| `src/core/relationships/scanner-plugins/go.ts` | Remove `defaultSourceBlock` |
| `src/core/relationships/scanner-plugins/rust.ts` | Remove `defaultSourceBlock` |
| `src/core/relationships/scanner-plugins/` (new file) | `ai-attribution.ts` — AI scan orchestrator |
| `src/ai/prompts/` (new file) | `relationship-attribution.ts` — prompt builder + response parser |
| `src/core/index-builder/build.ts` | Include file-level relationships in index |
| `src/cli/commands/scan.ts` | Add `--ai`, `--static-only` flags; call AI scan |
| `src/cli/commands/resolve.ts` | Call AI scan when `ai_scan: 'on_commit'` |
| `tests/unit/scanner-core.test.ts` | Update for file-level attribution |
| `tests/unit/` (new file) | `ai-attribution.test.ts` |

---

## Open Questions / Non-Goals

- **AI scan does not run on blocks with no file-level edges** — same-file block-to-block relationships are out of scope for this iteration.
- **No `--file` scoping for AI scan** — the existing `--file` flag on `git why scan` applies to static scan only. AI scan always processes all qualifying files.
- **No removal of file-level edges after AI attribution** — they coexist and serve different audiences (file-level for quick overview, block-level for precise navigation).
