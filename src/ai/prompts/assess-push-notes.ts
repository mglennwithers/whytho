export interface PushNoteAssessment {
  index: number
  verdict: 'complementary' | 'redundant' | 'conflict'
}

export function buildAssessPushNotesPrompt(
  inferredBody: string,
  pushNotes: Array<{ index: number; body: string }>,
): string {
  const notesList = pushNotes
    .map((n) => `[${n.index}]\n${n.body}`)
    .join('\n\n')

  return `You are a technical documentation reviewer. A code block has been re-annotated by an AI inference pass. You are given the fresh inferred annotation body and a list of developer-authored push notes. Classify each push note against the inferred body.

Inferred annotation body:
---
${inferredBody}
---

Developer push notes to assess:
${notesList}

For each push note, respond with one line in this exact format:
[<index>] <verdict>

Where <verdict> is one of:
- COMPLEMENTARY — the note adds information not covered by the inferred body (e.g. a rejected-alternative decision, a constraint, a historical context). Keep it.
- REDUNDANT — the note repeats something already stated or clearly implied by the inferred body. Discard it.
- CONFLICT — the note contradicts a specific claim in the inferred body. Archive it.

Rules:
- A note is COMPLEMENTARY if it adds any meaningful information, even if tangentially related.
- A note is only REDUNDANT if its entire content is already captured in the inferred body.
- A note is CONFLICT only if it directly contradicts a factual claim (not just a different emphasis).
- When in doubt, prefer COMPLEMENTARY over REDUNDANT.

Respond with exactly ${pushNotes.length} line(s), one per note.`
}

export function parseAssessPushNotesResponse(
  response: string,
  count: number,
): PushNoteAssessment[] {
  const results: PushNoteAssessment[] = []
  const lines = response.trim().split('\n')

  for (const line of lines) {
    const m = line.match(/\[(\d+)\]\s+(COMPLEMENTARY|REDUNDANT|CONFLICT)/i)
    if (!m) continue
    const index = parseInt(m[1], 10)
    const raw = m[2].toUpperCase()
    const verdict =
      raw === 'COMPLEMENTARY'
        ? 'complementary'
        : raw === 'REDUNDANT'
          ? 'redundant'
          : 'conflict'
    results.push({ index, verdict })
    if (results.length === count) break
  }

  // Fill any missing indices as complementary (safe default)
  const seen = new Set(results.map((r) => r.index))
  for (const note of Array.from({ length: count }, (_, i) => i)) {
    if (!seen.has(note)) {
      results.push({ index: note, verdict: 'complementary' })
    }
  }

  return results
}
