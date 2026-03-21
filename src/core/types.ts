import { z } from 'zod'
import {
  WHYTHO_VERSION,
  CANONICAL_METRICS,
  RESOLUTION_OUTCOMES,
  RELATIONSHIP_TYPES,
  BLOCK_KINDS,
  ANNOTATION_TYPES,
  ARCHIVE_REASONS,
} from './constants.js'

// ─── Primitive Types ──────────────────────────────────────────────────────────

export type WhythoVersion = typeof WHYTHO_VERSION
export type CanonicalMetric = (typeof CANONICAL_METRICS)[number]
export type ResolutionOutcome = (typeof RESOLUTION_OUTCOMES)[number]
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number]
export type BlockKind = (typeof BLOCK_KINDS)[number]
export type AnnotationType = (typeof ANNOTATION_TYPES)[number]
export type ArchiveReason = (typeof ARCHIVE_REASONS)[number]

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const StructuralPositionSchema = z.object({
  kind: z.enum(BLOCK_KINDS),
  parent_scope: z.string(),
  name: z.string(),
  parameters: z.string().optional(),
  index_in_parent: z.number().int().nonnegative(),
})

export const BlockIdentitySchema = z.object({
  symbolic: z.string(),
  line_range: z.object({
    start: z.number().int().positive(),
    end: z.number().int().positive(),
    commit: z.string(),
  }),
  content_hash: z.string().regex(/^sha256:[0-9a-f]{64}$/),
  structural: StructuralPositionSchema,
  semantic_fingerprint: z.string(),
  canonical_metric: z.enum(CANONICAL_METRICS),
  confidence: z.number().min(0).max(1),
  last_resolved: z.string(),
})

export const RelationshipSchema = z.object({
  type: z.enum(RELATIONSHIP_TYPES),
  target: z.string(),
  description: z.string().optional(),
  bidirectional: z.boolean().optional(),
})

export const BaseAnnotationSchema = z.object({
  whytho: z.literal('1.0'),
  type: z.enum(ANNOTATION_TYPES),
  created: z.string(),
  updated: z.string(),
})

export const SessionCommitSchema = z.object({
  sha: z.string(),
  message: z.string(),
  timestamp: z.string(),
})

export const SessionFrontmatterSchema = BaseAnnotationSchema.extend({
  type: z.literal('session'),
  id: z.string(),
  model: z.string(),
  commits: z.array(SessionCommitSchema),
  files_touched: z.array(z.string()),
  ended: z.string().optional(),
  model_provider: z.string().optional(),
  user: z.string().optional(),
  folders_touched: z.array(z.string()).optional(),
  blocks_touched: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export const FolderFrontmatterSchema = BaseAnnotationSchema.extend({
  type: z.literal('folder'),
  path: z.string(),
  updated_by_session: z.string(),
  parent_folder: z.string().optional(),
  contained_files: z.array(z.string()).optional(),
  sessions: z.array(z.string()).optional(),
})

export const FileFrontmatterSchema = BaseAnnotationSchema.extend({
  type: z.literal('file'),
  path: z.string(),
  updated_by_session: z.string(),
  parent_folder: z.string(),
  sessions: z.array(z.string()).optional(),
  blocks: z.array(z.string()).optional(),
  language: z.string().optional(),
})

export const BlockFrontmatterSchema = BaseAnnotationSchema.extend({
  type: z.literal('block'),
  symbolic_ref: z.string(),
  file: z.string(),
  created_by_session: z.string(),
  updated_by_session: z.string(),
  identity: BlockIdentitySchema,
  relationships: z.array(RelationshipSchema).optional(),
  derived_from: z.string().optional(),
  parents: z.array(z.string()).optional(),
  resolution_status: z.string().optional(),
  archived_at: z.string().optional(),
  archived_reason: z.enum(ARCHIVE_REASONS).optional(),
  archived_by_session: z.string().optional(),
  archived_at_commit: z.string().optional(),
})

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export type StructuralPosition = z.infer<typeof StructuralPositionSchema>
export type BlockIdentity = z.infer<typeof BlockIdentitySchema>
export type Relationship = z.infer<typeof RelationshipSchema>
export type SessionCommit = z.infer<typeof SessionCommitSchema>
export type SessionFrontmatter = z.infer<typeof SessionFrontmatterSchema>
export type FolderFrontmatter = z.infer<typeof FolderFrontmatterSchema>
export type FileFrontmatter = z.infer<typeof FileFrontmatterSchema>
export type BlockFrontmatter = z.infer<typeof BlockFrontmatterSchema>

export type AnyFrontmatter =
  | SessionFrontmatter
  | FolderFrontmatter
  | FileFrontmatter
  | BlockFrontmatter

// ─── Index Schema Types ───────────────────────────────────────────────────────

export interface SessionIndexEntry {
  id: string
  created: string
  folders_touched: string[]
  files_touched: string[]
  blocks_touched: string[]
  commits: string[]
}

export interface FolderIndexEntry {
  path: string
  parent_folder?: string
  contained_files: string[]
  sessions: string[]
}

export interface FileIndexEntry {
  path: string
  parent_folder: string
  blocks: string[]
  sessions: string[]
}

export interface BlockIndexEntry {
  symbolic_ref: string
  file: string
  canonical_metric: CanonicalMetric
  confidence: number
  last_resolved: string
  content_hash: string
  created_by_session: string
  updated_by_session: string
  relationships_out: Array<{ type: RelationshipType; target: string }>
  relationships_in: Array<{ type: RelationshipType; source: string }>
}

export interface RelationshipEdge {
  type: RelationshipType
  source: string
  target: string
}

export interface WhythoIndex {
  whytho_version: WhythoVersion
  generated_at: string
  generated_at_commit: string
  sessions: Record<string, SessionIndexEntry>
  folders: Record<string, FolderIndexEntry>
  files: Record<string, FileIndexEntry>
  blocks: Record<string, BlockIndexEntry>
  relationships: RelationshipEdge[]
  unresolved: string[]
}

export interface ArchivedBlockEntry extends BlockIndexEntry {
  archived_at: string
  archived_reason: ArchiveReason
  archived_by_session: string
  archived_at_commit: string
  successor?: string
  last_known_confidence: number
  last_known_content_hash: string
}

export interface WhythoArchiveIndex {
  whytho_version: WhythoVersion
  generated_at: string
  sessions: Record<string, SessionIndexEntry>
  folders: Record<string, FolderIndexEntry>
  files: Record<string, FileIndexEntry>
  blocks: Record<string, ArchivedBlockEntry>
}

// ─── Annotation File (parsed) ─────────────────────────────────────────────────

export interface AnnotationFile<T extends AnyFrontmatter = AnyFrontmatter> {
  frontmatter: T
  body: string
  filePath: string
}

// ─── Hook Event ───────────────────────────────────────────────────────────────

export interface HookEvent {
  event: 'relationship_target_changed'
  whytho_version: WhythoVersion
  timestamp: string
  commit: string
  session?: string
  relationship: {
    type: RelationshipType
    source: string
    target: string
  }
  change: {
    type: string
    target_resolution: ResolutionOutcome
    target_previous_hash?: string
    target_current_hash?: string
    target_confidence?: number
  }
}
