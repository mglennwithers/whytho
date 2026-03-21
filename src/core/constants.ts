export const WHYTHO_VERSION = '1.0' as const
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

export const DEFAULT_AI_MODEL = 'claude-opus-4-6'
export const DEFAULT_AI_PROVIDER = 'anthropic'

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
  'overrides',
  'derived_from',
  'depends_on',
  'configures',
  'implements',
  'tests',
  'validates',
  'documents',
] as const

export const BLOCK_KINDS = [
  'function',
  'method',
  'class',
  'interface',
  'type',
  'const',
  'config',
  'describe',
  'it',
  'test',
] as const

export const ANNOTATION_TYPES = ['session', 'folder', 'file', 'block'] as const
export const ARCHIVE_REASONS = ['deleted', 'superseded', 'split', 'merged'] as const
