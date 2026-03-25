export const WHYTHO_VERSION = '1.0'
export const SPEC_VERSION = '1.0.0'

export const WHY_DIR = '.why'
export const SESSIONS_DIR = 'sessions'
export const FOLDERS_DIR = 'folders'
export const FILES_DIR = 'files'
export const BLOCKS_DIR = 'blocks'
export const ARCHIVE_DIR = 'archive'
export const INDEX_FILE = 'index.json'
export const ARCHIVE_INDEX_FILE = 'archive-index.json'

export const ROOT_FOLDER_ANNOTATION = 'root.md'
export const PATH_SEPARATOR = '--'

export const DEFAULT_CONFIDENCE_THRESHOLD = 0.3
export const DEFAULT_SUPERSEDED_THRESHOLD = 0.3
export const SEMANTIC_MATCH_MIN_CONFIDENCE = 0.7
export const DEFAULT_SEMANTIC_TIMEOUT_MS = 10_000

export const DEFAULT_AI_MODEL = 'claude-sonnet-4-6'
export const DEFAULT_INFER_MODEL = 'claude-haiku-4-5-20251001'
export const DEFAULT_AI_PROVIDER = 'anthropic'

export const DEFAULT_OPENAI_MODEL = 'gpt-4o'
export const DEFAULT_OPENAI_INFER_MODEL = 'gpt-4o-mini'

export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'
export const DEFAULT_GEMINI_INFER_MODEL = 'gemini-2.0-flash'

export const HOOK_SENTINEL = '# whytho-hook-v1'
export const POST_COMMIT_HOOK_NAME = 'post-commit'
export const PRE_COMMIT_HOOK_NAME = 'pre-commit'

export const CANONICAL_METRICS = [
  'symbolic',
  'line_range',
  'content_hash',
  'structural',
  'semantic_fingerprint',
  'none',
] as const

export const RESOLUTION_OUTCOMES = [
  'RESOLVED',
  'RELOCATED',
  'RENAMED',
  'SPLIT',
  'MERGED',
  'DELETED',
  'SUPERSEDED',
  'UNRESOLVABLE',
] as const

export const RELATIONSHIP_TYPES = [
  'extends',
  'depends_on',
  'implements',
  'tests',
] as const

export const BLOCK_KINDS = [
  'function',
  'method',
  'constructor',
  'class',
  'interface',
  'type',
  'const',
  'property',
  'config',
  'describe',
  'it',
  'test',
] as const

export const ANNOTATION_TYPES = ['session', 'folder', 'file', 'block'] as const
export const ARCHIVE_REASONS = ['deleted', 'superseded', 'split', 'merged'] as const
