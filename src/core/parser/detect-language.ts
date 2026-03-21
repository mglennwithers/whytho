import * as path from 'path'

const EXT_TO_LANGUAGE: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.mts': 'typescript',
  '.cts': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.py': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.c': 'c',
  '.php': 'php',
  '.swift': 'swift',
  '.kt': 'kotlin',
}

export function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  return EXT_TO_LANGUAGE[ext] ?? 'unknown'
}

export function isTypeScriptOrJavaScript(filePath: string): boolean {
  const lang = detectLanguage(filePath)
  return lang === 'typescript' || lang === 'javascript'
}
