import { z, ZodError } from 'zod';

declare const WHYTHO_VERSION: "1.0";
declare const CANONICAL_METRICS: readonly ["symbolic", "line_range", "content_hash", "structural", "semantic_fingerprint", "none"];
declare const RESOLUTION_OUTCOMES: readonly ["RESOLVED", "RELOCATED", "RENAMED", "SPLIT", "MERGED", "DELETED", "SUPERSEDED", "UNRESOLVABLE"];
declare const RELATIONSHIP_TYPES: readonly ["extends", "overrides", "derived_from", "depends_on", "configures", "implements", "tests", "validates", "documents"];
declare const BLOCK_KINDS: readonly ["function", "method", "class", "interface", "type", "const", "config", "describe", "it", "test"];
declare const ANNOTATION_TYPES: readonly ["session", "folder", "file", "block"];
declare const ARCHIVE_REASONS: readonly ["deleted", "superseded", "split", "merged"];

type WhythoVersion = typeof WHYTHO_VERSION;
type CanonicalMetric = (typeof CANONICAL_METRICS)[number];
type ResolutionOutcome = (typeof RESOLUTION_OUTCOMES)[number];
type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
type BlockKind = (typeof BLOCK_KINDS)[number];
type AnnotationType = (typeof ANNOTATION_TYPES)[number];
type ArchiveReason = (typeof ARCHIVE_REASONS)[number];
declare const StructuralPositionSchema: z.ZodObject<{
    kind: z.ZodEnum<["function", "method", "class", "interface", "type", "const", "config", "describe", "it", "test"]>;
    parent_scope: z.ZodString;
    name: z.ZodString;
    parameters: z.ZodOptional<z.ZodString>;
    index_in_parent: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
    parent_scope: string;
    name: string;
    index_in_parent: number;
    parameters?: string | undefined;
}, {
    kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
    parent_scope: string;
    name: string;
    index_in_parent: number;
    parameters?: string | undefined;
}>;
declare const BlockIdentitySchema: z.ZodObject<{
    symbolic: z.ZodString;
    line_range: z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodNumber;
        commit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        start: number;
        end: number;
        commit: string;
    }, {
        start: number;
        end: number;
        commit: string;
    }>;
    content_hash: z.ZodString;
    structural: z.ZodObject<{
        kind: z.ZodEnum<["function", "method", "class", "interface", "type", "const", "config", "describe", "it", "test"]>;
        parent_scope: z.ZodString;
        name: z.ZodString;
        parameters: z.ZodOptional<z.ZodString>;
        index_in_parent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
        parent_scope: string;
        name: string;
        index_in_parent: number;
        parameters?: string | undefined;
    }, {
        kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
        parent_scope: string;
        name: string;
        index_in_parent: number;
        parameters?: string | undefined;
    }>;
    semantic_fingerprint: z.ZodString;
    canonical_metric: z.ZodEnum<["symbolic", "line_range", "content_hash", "structural", "semantic_fingerprint", "none"]>;
    confidence: z.ZodNumber;
    last_resolved: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbolic: string;
    line_range: {
        start: number;
        end: number;
        commit: string;
    };
    content_hash: string;
    structural: {
        kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
        parent_scope: string;
        name: string;
        index_in_parent: number;
        parameters?: string | undefined;
    };
    semantic_fingerprint: string;
    canonical_metric: "symbolic" | "line_range" | "content_hash" | "structural" | "semantic_fingerprint" | "none";
    confidence: number;
    last_resolved: string;
}, {
    symbolic: string;
    line_range: {
        start: number;
        end: number;
        commit: string;
    };
    content_hash: string;
    structural: {
        kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
        parent_scope: string;
        name: string;
        index_in_parent: number;
        parameters?: string | undefined;
    };
    semantic_fingerprint: string;
    canonical_metric: "symbolic" | "line_range" | "content_hash" | "structural" | "semantic_fingerprint" | "none";
    confidence: number;
    last_resolved: string;
}>;
declare const RelationshipSchema: z.ZodObject<{
    type: z.ZodEnum<["extends", "overrides", "derived_from", "depends_on", "configures", "implements", "tests", "validates", "documents"]>;
    target: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    bidirectional: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "extends" | "overrides" | "derived_from" | "depends_on" | "configures" | "implements" | "tests" | "validates" | "documents";
    target: string;
    description?: string | undefined;
    bidirectional?: boolean | undefined;
}, {
    type: "extends" | "overrides" | "derived_from" | "depends_on" | "configures" | "implements" | "tests" | "validates" | "documents";
    target: string;
    description?: string | undefined;
    bidirectional?: boolean | undefined;
}>;
declare const SessionCommitSchema: z.ZodObject<{
    sha: z.ZodString;
    message: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    sha: string;
    timestamp: string;
}, {
    message: string;
    sha: string;
    timestamp: string;
}>;
declare const SessionFrontmatterSchema: z.ZodObject<{
    whytho: z.ZodLiteral<"1.0">;
    created: z.ZodString;
    updated: z.ZodString;
} & {
    type: z.ZodLiteral<"session">;
    id: z.ZodString;
    model: z.ZodString;
    commits: z.ZodArray<z.ZodObject<{
        sha: z.ZodString;
        message: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        sha: string;
        timestamp: string;
    }, {
        message: string;
        sha: string;
        timestamp: string;
    }>, "many">;
    files_touched: z.ZodArray<z.ZodString, "many">;
    ended: z.ZodOptional<z.ZodString>;
    model_provider: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
    folders_touched: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    blocks_touched: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "session";
    whytho: "1.0";
    created: string;
    updated: string;
    id: string;
    model: string;
    commits: {
        message: string;
        sha: string;
        timestamp: string;
    }[];
    files_touched: string[];
    ended?: string | undefined;
    model_provider?: string | undefined;
    user?: string | undefined;
    folders_touched?: string[] | undefined;
    blocks_touched?: string[] | undefined;
    tags?: string[] | undefined;
}, {
    type: "session";
    whytho: "1.0";
    created: string;
    updated: string;
    id: string;
    model: string;
    commits: {
        message: string;
        sha: string;
        timestamp: string;
    }[];
    files_touched: string[];
    ended?: string | undefined;
    model_provider?: string | undefined;
    user?: string | undefined;
    folders_touched?: string[] | undefined;
    blocks_touched?: string[] | undefined;
    tags?: string[] | undefined;
}>;
declare const FolderFrontmatterSchema: z.ZodObject<{
    whytho: z.ZodLiteral<"1.0">;
    created: z.ZodString;
    updated: z.ZodString;
} & {
    type: z.ZodLiteral<"folder">;
    path: z.ZodString;
    updated_by_session: z.ZodString;
    parent_folder: z.ZodOptional<z.ZodString>;
    contained_files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sessions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "folder";
    path: string;
    whytho: "1.0";
    created: string;
    updated: string;
    updated_by_session: string;
    sessions?: string[] | undefined;
    parent_folder?: string | undefined;
    contained_files?: string[] | undefined;
}, {
    type: "folder";
    path: string;
    whytho: "1.0";
    created: string;
    updated: string;
    updated_by_session: string;
    sessions?: string[] | undefined;
    parent_folder?: string | undefined;
    contained_files?: string[] | undefined;
}>;
declare const FileFrontmatterSchema: z.ZodObject<{
    whytho: z.ZodLiteral<"1.0">;
    created: z.ZodString;
    updated: z.ZodString;
} & {
    type: z.ZodLiteral<"file">;
    path: z.ZodString;
    updated_by_session: z.ZodString;
    parent_folder: z.ZodString;
    sessions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    blocks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    language: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "file";
    path: string;
    whytho: "1.0";
    created: string;
    updated: string;
    updated_by_session: string;
    parent_folder: string;
    sessions?: string[] | undefined;
    blocks?: string[] | undefined;
    language?: string | undefined;
}, {
    type: "file";
    path: string;
    whytho: "1.0";
    created: string;
    updated: string;
    updated_by_session: string;
    parent_folder: string;
    sessions?: string[] | undefined;
    blocks?: string[] | undefined;
    language?: string | undefined;
}>;
declare const BlockFrontmatterSchema: z.ZodObject<{
    whytho: z.ZodLiteral<"1.0">;
    created: z.ZodString;
    updated: z.ZodString;
} & {
    type: z.ZodLiteral<"block">;
    symbolic_ref: z.ZodString;
    file: z.ZodString;
    created_by_session: z.ZodString;
    updated_by_session: z.ZodString;
    identity: z.ZodObject<{
        symbolic: z.ZodString;
        line_range: z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
            commit: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: number;
            end: number;
            commit: string;
        }, {
            start: number;
            end: number;
            commit: string;
        }>;
        content_hash: z.ZodString;
        structural: z.ZodObject<{
            kind: z.ZodEnum<["function", "method", "class", "interface", "type", "const", "config", "describe", "it", "test"]>;
            parent_scope: z.ZodString;
            name: z.ZodString;
            parameters: z.ZodOptional<z.ZodString>;
            index_in_parent: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
            parent_scope: string;
            name: string;
            index_in_parent: number;
            parameters?: string | undefined;
        }, {
            kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
            parent_scope: string;
            name: string;
            index_in_parent: number;
            parameters?: string | undefined;
        }>;
        semantic_fingerprint: z.ZodString;
        canonical_metric: z.ZodEnum<["symbolic", "line_range", "content_hash", "structural", "semantic_fingerprint", "none"]>;
        confidence: z.ZodNumber;
        last_resolved: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbolic: string;
        line_range: {
            start: number;
            end: number;
            commit: string;
        };
        content_hash: string;
        structural: {
            kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
            parent_scope: string;
            name: string;
            index_in_parent: number;
            parameters?: string | undefined;
        };
        semantic_fingerprint: string;
        canonical_metric: "symbolic" | "line_range" | "content_hash" | "structural" | "semantic_fingerprint" | "none";
        confidence: number;
        last_resolved: string;
    }, {
        symbolic: string;
        line_range: {
            start: number;
            end: number;
            commit: string;
        };
        content_hash: string;
        structural: {
            kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
            parent_scope: string;
            name: string;
            index_in_parent: number;
            parameters?: string | undefined;
        };
        semantic_fingerprint: string;
        canonical_metric: "symbolic" | "line_range" | "content_hash" | "structural" | "semantic_fingerprint" | "none";
        confidence: number;
        last_resolved: string;
    }>;
    relationships: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["extends", "overrides", "derived_from", "depends_on", "configures", "implements", "tests", "validates", "documents"]>;
        target: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        bidirectional: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "extends" | "overrides" | "derived_from" | "depends_on" | "configures" | "implements" | "tests" | "validates" | "documents";
        target: string;
        description?: string | undefined;
        bidirectional?: boolean | undefined;
    }, {
        type: "extends" | "overrides" | "derived_from" | "depends_on" | "configures" | "implements" | "tests" | "validates" | "documents";
        target: string;
        description?: string | undefined;
        bidirectional?: boolean | undefined;
    }>, "many">>;
    derived_from: z.ZodOptional<z.ZodString>;
    parents: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    resolution_status: z.ZodOptional<z.ZodString>;
    archived_at: z.ZodOptional<z.ZodString>;
    archived_reason: z.ZodOptional<z.ZodEnum<["deleted", "superseded", "split", "merged"]>>;
    archived_by_session: z.ZodOptional<z.ZodString>;
    archived_at_commit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "block";
    file: string;
    whytho: "1.0";
    created: string;
    updated: string;
    updated_by_session: string;
    symbolic_ref: string;
    created_by_session: string;
    identity: {
        symbolic: string;
        line_range: {
            start: number;
            end: number;
            commit: string;
        };
        content_hash: string;
        structural: {
            kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
            parent_scope: string;
            name: string;
            index_in_parent: number;
            parameters?: string | undefined;
        };
        semantic_fingerprint: string;
        canonical_metric: "symbolic" | "line_range" | "content_hash" | "structural" | "semantic_fingerprint" | "none";
        confidence: number;
        last_resolved: string;
    };
    derived_from?: string | undefined;
    relationships?: {
        type: "extends" | "overrides" | "derived_from" | "depends_on" | "configures" | "implements" | "tests" | "validates" | "documents";
        target: string;
        description?: string | undefined;
        bidirectional?: boolean | undefined;
    }[] | undefined;
    parents?: string[] | undefined;
    resolution_status?: string | undefined;
    archived_at?: string | undefined;
    archived_reason?: "deleted" | "superseded" | "split" | "merged" | undefined;
    archived_by_session?: string | undefined;
    archived_at_commit?: string | undefined;
}, {
    type: "block";
    file: string;
    whytho: "1.0";
    created: string;
    updated: string;
    updated_by_session: string;
    symbolic_ref: string;
    created_by_session: string;
    identity: {
        symbolic: string;
        line_range: {
            start: number;
            end: number;
            commit: string;
        };
        content_hash: string;
        structural: {
            kind: "function" | "method" | "class" | "interface" | "type" | "const" | "config" | "describe" | "it" | "test";
            parent_scope: string;
            name: string;
            index_in_parent: number;
            parameters?: string | undefined;
        };
        semantic_fingerprint: string;
        canonical_metric: "symbolic" | "line_range" | "content_hash" | "structural" | "semantic_fingerprint" | "none";
        confidence: number;
        last_resolved: string;
    };
    derived_from?: string | undefined;
    relationships?: {
        type: "extends" | "overrides" | "derived_from" | "depends_on" | "configures" | "implements" | "tests" | "validates" | "documents";
        target: string;
        description?: string | undefined;
        bidirectional?: boolean | undefined;
    }[] | undefined;
    parents?: string[] | undefined;
    resolution_status?: string | undefined;
    archived_at?: string | undefined;
    archived_reason?: "deleted" | "superseded" | "split" | "merged" | undefined;
    archived_by_session?: string | undefined;
    archived_at_commit?: string | undefined;
}>;
type StructuralPosition = z.infer<typeof StructuralPositionSchema>;
type BlockIdentity = z.infer<typeof BlockIdentitySchema>;
type Relationship = z.infer<typeof RelationshipSchema>;
type SessionCommit = z.infer<typeof SessionCommitSchema>;
type SessionFrontmatter = z.infer<typeof SessionFrontmatterSchema>;
type FolderFrontmatter = z.infer<typeof FolderFrontmatterSchema>;
type FileFrontmatter = z.infer<typeof FileFrontmatterSchema>;
type BlockFrontmatter = z.infer<typeof BlockFrontmatterSchema>;
type AnyFrontmatter = SessionFrontmatter | FolderFrontmatter | FileFrontmatter | BlockFrontmatter;
interface SessionIndexEntry {
    id: string;
    created: string;
    folders_touched: string[];
    files_touched: string[];
    blocks_touched: string[];
    commits: string[];
}
interface FolderIndexEntry {
    path: string;
    parent_folder?: string;
    contained_files: string[];
    sessions: string[];
}
interface FileIndexEntry {
    path: string;
    parent_folder: string;
    blocks: string[];
    sessions: string[];
}
interface BlockIndexEntry {
    symbolic_ref: string;
    file: string;
    canonical_metric: CanonicalMetric;
    confidence: number;
    last_resolved: string;
    content_hash: string;
    created_by_session: string;
    updated_by_session: string;
    relationships_out: Array<{
        type: RelationshipType;
        target: string;
    }>;
    relationships_in: Array<{
        type: RelationshipType;
        source: string;
    }>;
}
interface RelationshipEdge {
    type: RelationshipType;
    source: string;
    target: string;
}
interface WhythoIndex {
    whytho_version: WhythoVersion;
    generated_at: string;
    generated_at_commit: string;
    sessions: Record<string, SessionIndexEntry>;
    folders: Record<string, FolderIndexEntry>;
    files: Record<string, FileIndexEntry>;
    blocks: Record<string, BlockIndexEntry>;
    relationships: RelationshipEdge[];
    unresolved: string[];
}
interface ArchivedBlockEntry extends BlockIndexEntry {
    archived_at: string;
    archived_reason: ArchiveReason;
    archived_by_session: string;
    archived_at_commit: string;
    successor?: string;
    last_known_confidence: number;
    last_known_content_hash: string;
}
interface WhythoArchiveIndex {
    whytho_version: WhythoVersion;
    generated_at: string;
    sessions: Record<string, SessionIndexEntry>;
    folders: Record<string, FolderIndexEntry>;
    files: Record<string, FileIndexEntry>;
    blocks: Record<string, ArchivedBlockEntry>;
}
interface AnnotationFile<T extends AnyFrontmatter = AnyFrontmatter> {
    frontmatter: T;
    body: string;
    filePath: string;
}
interface HookEvent {
    event: 'relationship_target_changed';
    whytho_version: WhythoVersion;
    timestamp: string;
    commit: string;
    session?: string;
    relationship: {
        type: RelationshipType;
        source: string;
        target: string;
    };
    change: {
        type: string;
        target_resolution: ResolutionOutcome;
        target_previous_hash?: string;
        target_current_hash?: string;
        target_confidence?: number;
    };
}

declare function getWhyRoot(repoRoot: string): string;
declare function sessionsDir(whyRoot: string): string;
declare function foldersDir(whyRoot: string): string;
declare function filesDir(whyRoot: string): string;
declare function blocksDir(whyRoot: string): string;
declare function archiveDir(whyRoot: string, type?: AnnotationType): string;
declare function indexPath(whyRoot: string): string;
declare function archiveIndexPath(whyRoot: string): string;
/**
 * Convert a source file or folder path to an annotation filename slug.
 * 'src/auth/middleware.ts' → 'src--auth--middleware.ts'
 */
declare function slugFromPath(sourcePath: string): string;
/**
 * Convert a block symbolic ref to an annotation filename slug.
 * 'src/auth/middleware.ts::rotateTokenIfNeeded' → 'src--auth--middleware.ts--rotateTokenIfNeeded'
 */
declare function slugFromBlockRef(symbolicRef: string): string;
/**
 * Slugify a block name for use in filenames.
 * Replaces non-alphanumeric/hyphen chars with hyphens, lowercases.
 * 'describe("rotation")' → 'describe-rotation'
 */
declare function slugifyBlockName(name: string): string;
/**
 * Recover the original path from a slug (reverses slugFromPath).
 * 'src--auth--middleware.ts' → 'src/auth/middleware.ts'
 */
declare function pathFromSlug(slug: string): string;
declare function sessionAnnotationPath(whyRoot: string, sessionId: string): string;
declare function folderAnnotationPath(whyRoot: string, folderPath: string): string;
declare function fileAnnotationPath(whyRoot: string, filePath: string): string;
declare function blockAnnotationPath(whyRoot: string, symbolicRef: string): string;
declare function parseSymbolicRef(ref: string): {
    file: string;
    block: string;
};
declare function buildSymbolicRef(filePath: string, blockName: string): string;
/**
 * Get the parent folder of a file path.
 * 'src/auth/middleware.ts' → 'src/auth/'
 */
declare function parentFolder(filePath: string): string;

declare function initWhyDir(repoRoot: string): Promise<void>;
declare function isWhyDirInitialized(repoRoot: string): Promise<boolean>;

/**
 * Atomically write a file using write-to-temp-then-rename.
 * Prevents corrupt state if the process is interrupted mid-write.
 */
declare function writeFile(filePath: string, content: string): Promise<void>;
declare function writeJson(filePath: string, data: unknown): Promise<void>;
declare function fileExists(filePath: string): Promise<boolean>;
declare function moveFile(src: string, dest: string): Promise<void>;

declare function readAnnotationFile<T extends AnyFrontmatter>(filePath: string): Promise<AnnotationFile<T>>;
declare function readAllBlocks(whyRoot: string): Promise<AnnotationFile<BlockFrontmatter>[]>;
declare function readAllFiles(whyRoot: string): Promise<AnnotationFile<FileFrontmatter>[]>;
declare function readAllFolders(whyRoot: string): Promise<AnnotationFile<FolderFrontmatter>[]>;
declare function readAllSessions(whyRoot: string): Promise<AnnotationFile<SessionFrontmatter>[]>;
declare function readAllArchivedBlocks(whyRoot: string): Promise<AnnotationFile<BlockFrontmatter>[]>;
declare function readIndex(whyRoot: string): Promise<Record<string, unknown>>;

interface ParsedAnnotation<T extends AnyFrontmatter = AnyFrontmatter> {
    frontmatter: T;
    body: string;
}
declare function parseAnnotation<T extends AnyFrontmatter>(raw: string): ParsedAnnotation<T>;

declare function serializeAnnotation(frontmatter: AnyFrontmatter, body: string): string;

declare class ValidationError extends Error {
    readonly issues: ZodError['issues'];
    constructor(message: string, issues: ZodError['issues']);
}
declare function validateAnnotation(data: unknown): AnyFrontmatter;

interface ParsedBlock {
    kind: BlockKind;
    name: string;
    parentScope: string;
    parameters?: string;
    indexInParent: number;
    startLine: number;
    endLine: number;
    content: string;
}
interface ParserPlugin {
    name: string;
    extensions: string[];
    parse(source: string, filePath: string): ParsedBlock[];
}

declare function registerPlugin(plugin: ParserPlugin): void;
declare function getPlugin(filePath: string): ParserPlugin;
declare function parseFile(source: string, filePath: string): ParsedBlock[];

declare function detectLanguage(filePath: string): string;
declare function isTypeScriptOrJavaScript(filePath: string): boolean;

/**
 * Compute the spec-compliant SHA-256 content hash for a block.
 * Spec §18.3: strip leading/trailing whitespace, normalize line endings to \n.
 */
declare function computeContentHash(blockContent: string): string;

interface AnnotationRequest {
    type: AnnotationType;
    context: {
        filePath?: string;
        blockSource?: string;
        parsedBlock?: ParsedBlock;
        sessionContext?: string;
        existingAnnotations?: string[];
        changedFiles?: string[];
        gitLog?: string;
    };
}
interface AnnotationResult {
    frontmatter: Record<string, unknown>;
    body: string;
}
interface SemanticMatchRequest {
    fingerprint: string;
    candidates: Array<{
        block: ParsedBlock;
        source: string;
    }>;
}
interface SemanticMatchResult {
    matchedIndex: number | null;
    confidence: number;
}
interface AIProvider {
    name: string;
    generateAnnotation(request: AnnotationRequest): Promise<AnnotationResult>;
    matchSemanticFingerprint(request: SemanticMatchRequest): Promise<SemanticMatchResult>;
}

interface ElectionInput {
    stored: BlockIdentity;
    candidates: ParsedBlock[];
    filePath: string;
    commitSha: string;
    source: string;
}
interface ElectionResult {
    outcome: ResolutionOutcome;
    canonical_metric: CanonicalMetric;
    confidence: number;
    matchedBlock?: ParsedBlock;
    updatedIdentity?: Partial<BlockIdentity>;
}
/**
 * Implements the 5-rule canonical metric election protocol from SPEC §9.3.
 */
declare function electCanonicalMetric(input: ElectionInput, ai?: AIProvider): Promise<ElectionResult>;

interface WhythoConfig {
    specVersion: '1.0';
    aiProvider: string;
    anthropic?: {
        model?: string;
        apiKeyEnv?: string;
    };
    resolution: {
        confidenceThreshold: number;
        supersededThreshold: number;
        runOnCommit: boolean;
        hookMode: 'post-commit' | 'pre-commit';
    };
    parser: {
        additionalPlugins: string[];
    };
    hooks: {
        onRelationshipChanged?: string;
        webhookUrl?: string;
    };
    privacy: {
        omitUser: boolean;
    };
}

interface ResolutionContext {
    whyRoot: string;
    repoRoot: string;
    commitSha: string;
    changedFiles: string[];
    sessionId?: string;
    config: WhythoConfig;
    ai?: AIProvider;
}
interface BlockResolutionResult {
    symbolicRef: string;
    outcome: ResolutionOutcome;
    confidence: number;
    newSymbolicRef?: string;
    hookEvents: HookEvent[];
    error?: string;
}
interface ResolutionReport {
    processedBlocks: number;
    outcomes: Record<string, ResolutionOutcome>;
    hookEvents: HookEvent[];
    errors: Record<string, string>;
}
declare function runResolutionPipeline(ctx: ResolutionContext): Promise<ResolutionReport>;

declare function buildIndex(whyRoot: string, commitSha: string): Promise<WhythoIndex>;
declare function rebuildArchiveIndex(whyRoot: string): Promise<WhythoArchiveIndex>;

interface ArchiveOptions {
    reason: ArchiveReason;
    bySession: string;
    atCommit: string;
    successor?: string;
}
declare function archiveBlockAnnotation(whyRoot: string, symbolicRef: string, options: ArchiveOptions): Promise<string | null>;

declare function findArchivedBlocks(whyRoot: string, symbolicRef: string): Promise<AnnotationFile<BlockFrontmatter>[]>;
declare function getBlockHistory(whyRoot: string, symbolicRef: string): Promise<AnnotationFile<BlockFrontmatter>[]>;

declare function getRelationshipsFrom(index: WhythoIndex, symbolicRef: string): RelationshipEdge[];
declare function getRelationshipsTo(index: WhythoIndex, symbolicRef: string): RelationshipEdge[];
declare function getAllRelated(index: WhythoIndex, symbolicRef: string): {
    direction: 'out' | 'in';
    edge: RelationshipEdge;
}[];

declare function buildHookEvent(params: {
    commit: string;
    session?: string;
    relationshipType: RelationshipType;
    source: string;
    target: string;
    changeType: string;
    targetResolution: ResolutionOutcome;
    targetPreviousHash?: string;
    targetCurrentHash?: string;
    targetConfidence?: number;
}): HookEvent;
declare function emitHookEvents(events: HookEvent[], config: WhythoConfig, repoRoot: string): Promise<void>;

declare function findRepoRoot(startDir?: string): Promise<string>;
declare function getHeadCommitSha(repoRoot: string): Promise<string>;
declare function getCurrentUser(repoRoot: string): Promise<string | undefined>;

/**
 * Get files changed between two commits (or between HEAD~1 and HEAD).
 */
declare function getChangedFiles(repoRoot: string, fromCommit?: string, toCommit?: string): Promise<string[]>;
/**
 * Get a diff string between two refs.
 */
declare function getDiffString(repoRoot: string, range: string): Promise<string>;

declare function installHook(repoRoot: string, hookMode?: 'post-commit' | 'pre-commit'): Promise<void>;
declare function uninstallHook(repoRoot: string, hookMode?: 'post-commit' | 'pre-commit'): Promise<void>;
declare function isHookInstalled(repoRoot: string, hookMode?: 'post-commit' | 'pre-commit'): Promise<boolean>;

declare function registerProvider(provider: AIProvider): void;
declare function getProvider(name: string): AIProvider | undefined;
declare function getDefaultProvider(config: WhythoConfig): AIProvider;

declare const nullProvider: AIProvider;

interface AnthropicProviderOptions {
    model?: string;
    apiKey?: string;
}
declare function createAnthropicProvider(options?: AnthropicProviderOptions): AIProvider;

type PushType = 'session' | 'block' | 'file';
interface PushInput {
    repoRoot: string;
    type: PushType;
    /** session ID, symbolic ref (file::block), or file path */
    ref: string;
    body: string;
    sessionId?: string;
}
interface PushResult {
    action: 'created' | 'updated';
    path: string;
}
declare function pushReasoning(input: PushInput): Promise<PushResult>;

declare function loadConfig(repoRoot: string): Promise<WhythoConfig>;

declare const DEFAULT_CONFIG: WhythoConfig;

export { type AIProvider, type AnnotationFile, type AnnotationRequest, type AnnotationResult, type AnnotationType, type AnyFrontmatter, type ArchiveReason, type ArchivedBlockEntry, BLOCK_KINDS, type BlockFrontmatter, BlockFrontmatterSchema, type BlockIdentity, BlockIdentitySchema, type BlockIndexEntry, type BlockKind, type BlockResolutionResult, CANONICAL_METRICS, type CanonicalMetric, DEFAULT_CONFIG, type ElectionInput, type ElectionResult, type FileFrontmatter, FileFrontmatterSchema, type FileIndexEntry, type FolderFrontmatter, FolderFrontmatterSchema, type FolderIndexEntry, type HookEvent, type ParsedBlock, type ParserPlugin, type PushInput, type PushResult, type PushType, RELATIONSHIP_TYPES, RESOLUTION_OUTCOMES, type Relationship, type RelationshipEdge, RelationshipSchema, type RelationshipType, type ResolutionContext, type ResolutionOutcome, type ResolutionReport, type SemanticMatchRequest, type SemanticMatchResult, type SessionCommit, type SessionFrontmatter, SessionFrontmatterSchema, type SessionIndexEntry, type StructuralPosition, ValidationError, WHYTHO_VERSION, type WhythoArchiveIndex, type WhythoConfig, type WhythoIndex, type WhythoVersion, archiveBlockAnnotation, archiveDir, archiveIndexPath, blockAnnotationPath, blocksDir, buildHookEvent, buildIndex, buildSymbolicRef, computeContentHash, createAnthropicProvider, detectLanguage, electCanonicalMetric, emitHookEvents, fileAnnotationPath, fileExists, filesDir, findArchivedBlocks, findRepoRoot, folderAnnotationPath, foldersDir, getAllRelated, getBlockHistory, getChangedFiles, getCurrentUser, getDefaultProvider, getDiffString, getHeadCommitSha, getPlugin, getProvider, getRelationshipsFrom, getRelationshipsTo, getWhyRoot, indexPath, initWhyDir, installHook, isHookInstalled, isTypeScriptOrJavaScript, isWhyDirInitialized, loadConfig, moveFile, nullProvider, parentFolder, parseAnnotation, parseFile, parseSymbolicRef, pathFromSlug, pushReasoning, readAllArchivedBlocks, readAllBlocks, readAllFiles, readAllFolders, readAllSessions, readAnnotationFile, readIndex, rebuildArchiveIndex, registerPlugin, registerProvider, runResolutionPipeline, serializeAnnotation, sessionAnnotationPath, sessionsDir, slugFromBlockRef, slugFromPath, slugifyBlockName, uninstallHook, validateAnnotation, writeFile, writeJson };
