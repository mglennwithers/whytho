/**
 * Extract a specific ## section from an annotation markdown body.
 * Returns the section content (without the heading) or null if not found.
 */
export function extractSection(body: string, heading: string): string | null {
  const pattern = new RegExp(
    `^##\\s+${escapeRegex(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'm',
  )
  const match = body.match(pattern)
  if (!match) return null
  return match[1].trim()
}

/**
 * Extract the Purpose section and return a short preview (first N chars).
 */
export function extractPurposePreview(body: string, maxLength = 120): string | null {
  const purpose = extractSection(body, 'Purpose')
  if (!purpose) return null
  const oneLine = purpose.replace(/\n+/g, ' ').trim()
  if (oneLine.length <= maxLength) return oneLine
  return oneLine.slice(0, maxLength - 1) + '\u2026'
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
