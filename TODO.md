# whytho — Project TODO

## Testing
- [ ] Build benchmarking tests to measure AI coding tool effectiveness with and without whytho annotations
- [ ] Investigate transient "No test suite found" failures on Windows when running the full test suite in parallel (passes on re-run; likely a worker startup race with vitest)

## Bugs / Polish
- [x] Fix naming inconsistency in config: `relationships.ai_scan` and `relationships.static_scan` are snake_case inside an otherwise camelCase config object
- [x] Fix vitest CJS deprecation warning ("The CJS build of Vite's Node API is deprecated")
- [ ] Resolve spec version mismatch: SPEC.md says `1.0.0-draft` but package.json ships as `1.0.0`

## Features
- [ ] VS Code extension — show block annotations inline at function definitions (data layer is ready via MCP server)
- [ ] GitHub Action — run `git why annotate` on PRs and post annotation coverage as a check status
- [ ] Additional AI providers — OpenAI and Gemini (AIProvider interface is already abstracted)
- [ ] `git why search --semantic "query"` — semantic search command (prompt exists in `src/ai/prompts/semantic-match.ts` but has no CLI surface)
- [x] Improve `git why status` — surface actionable annotation health: coverage %, unresolvable count, blocks that haven't resolved in N commits
- [ ] annotation requests should be more granular. the caller should be able to request whichever relevant sections they want

## Infrastructure
- [ ] npm publish workflow — GitHub Actions release automation to publish to npm on tag
