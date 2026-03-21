// ─── Core Types ───────────────────────────────────────────────────────────────
export type {
  WhythoVersion,
  CanonicalMetric,
  ResolutionOutcome,
  RelationshipType,
  BlockKind,
  AnnotationType,
  ArchiveReason,
  StructuralPosition,
  BlockIdentity,
  Relationship,
  SessionCommit,
  SessionFrontmatter,
  FolderFrontmatter,
  FileFrontmatter,
  BlockFrontmatter,
  AnyFrontmatter,
  SessionIndexEntry,
  FolderIndexEntry,
  FileIndexEntry,
  BlockIndexEntry,
  RelationshipEdge,
  WhythoIndex,
  WhythoArchiveIndex,
  ArchivedBlockEntry,
  AnnotationFile,
  HookEvent,
} from './core/types.js'

// ─── Zod Schemas ─────────────────────────────────────────────────────────────
export {
  BlockFrontmatterSchema,
  FileFrontmatterSchema,
  FolderFrontmatterSchema,
  SessionFrontmatterSchema,
  BlockIdentitySchema,
  RelationshipSchema,
} from './core/types.js'

// ─── Constants ────────────────────────────────────────────────────────────────
export {
  WHYTHO_VERSION,
  CANONICAL_METRICS,
  RESOLUTION_OUTCOMES,
  RELATIONSHIP_TYPES,
  BLOCK_KINDS,
} from './core/constants.js'

// ─── File System ─────────────────────────────────────────────────────────────
export {
  getWhyRoot,
  sessionsDir,
  foldersDir,
  filesDir,
  blocksDir,
  archiveDir,
  indexPath,
  archiveIndexPath,
  slugFromPath,
  slugFromBlockRef,
  slugifyBlockName,
  pathFromSlug,
  sessionAnnotationPath,
  folderAnnotationPath,
  fileAnnotationPath,
  blockAnnotationPath,
  parseSymbolicRef,
  buildSymbolicRef,
  parentFolder,
} from './core/fs/layout.js'

export { initWhyDir, isWhyDirInitialized } from './core/fs/init.js'
export { writeFile, writeJson, fileExists, moveFile } from './core/fs/writer.js'
export {
  readAnnotationFile,
  readAllBlocks,
  readAllFiles,
  readAllFolders,
  readAllSessions,
  readAllArchivedBlocks,
  readIndex,
} from './core/fs/reader.js'

// ─── Frontmatter ─────────────────────────────────────────────────────────────
export { parseAnnotation } from './core/frontmatter/parse.js'
export { serializeAnnotation } from './core/frontmatter/serialize.js'
export { validateAnnotation, ValidationError } from './core/frontmatter/validate.js'

// ─── Parser ───────────────────────────────────────────────────────────────────
export type { ParsedBlock, ParserPlugin } from './core/parser/types.js'
export { parseFile, registerPlugin, getPlugin } from './core/parser/registry.js'
export { detectLanguage, isTypeScriptOrJavaScript } from './core/parser/detect-language.js'

// ─── Identity ─────────────────────────────────────────────────────────────────
export { computeContentHash } from './core/identity/content-hash.js'
export { electCanonicalMetric } from './core/identity/election.js'
export type { ElectionInput, ElectionResult } from './core/identity/election.js'

// ─── Resolution ───────────────────────────────────────────────────────────────
export { runResolutionPipeline } from './core/resolution/pipeline.js'
export type { ResolutionContext, ResolutionReport, BlockResolutionResult } from './core/resolution/pipeline.js'

// ─── Index ────────────────────────────────────────────────────────────────────
export { buildIndex, rebuildArchiveIndex } from './core/index-builder/build.js'

// ─── Archive ─────────────────────────────────────────────────────────────────
export { archiveBlockAnnotation } from './core/archive/archiver.js'
export { getBlockHistory, findArchivedBlocks } from './core/archive/query.js'

// ─── Relationships ────────────────────────────────────────────────────────────
export { getRelationshipsFrom, getRelationshipsTo, getAllRelated } from './core/relationships/graph.js'
export { buildHookEvent, emitHookEvents } from './core/relationships/events.js'

// ─── Git ──────────────────────────────────────────────────────────────────────
export { findRepoRoot, getHeadCommitSha, getCurrentUser } from './core/git/repo.js'
export { getChangedFiles, getDiffString } from './core/git/diff.js'
export { installHook, uninstallHook, isHookInstalled } from './core/git/hooks/installer.js'

// ─── AI ───────────────────────────────────────────────────────────────────────
export type { AIProvider, AnnotationRequest, AnnotationResult, SemanticMatchRequest, SemanticMatchResult } from './ai/types.js'
export { registerProvider, getProvider, getDefaultProvider } from './ai/registry.js'
export { nullProvider } from './ai/providers/null.js'
export { createAnthropicProvider } from './ai/providers/anthropic.js'

// ─── Push ─────────────────────────────────────────────────────────────────────
export { pushReasoning } from './core/push/index.js'
export type { PushInput, PushResult, PushType } from './core/push/index.js'

// ─── Config ───────────────────────────────────────────────────────────────────
export type { WhythoConfig } from './config/types.js'
export { loadConfig } from './config/loader.js'
export { DEFAULT_CONFIG } from './config/defaults.js'
