"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core/constants.ts
var WHYTHO_VERSION, WHY_DIR, SESSIONS_DIR, FOLDERS_DIR, FILES_DIR, BLOCKS_DIR, ARCHIVE_DIR, INDEX_FILE, ARCHIVE_INDEX_FILE, ROOT_FOLDER_ANNOTATION, PATH_SEPARATOR, DEFAULT_CONFIDENCE_THRESHOLD, DEFAULT_SUPERSEDED_THRESHOLD, SEMANTIC_MATCH_MIN_CONFIDENCE, DEFAULT_SEMANTIC_TIMEOUT_MS, DEFAULT_AI_MODEL, DEFAULT_AI_PROVIDER, HOOK_SENTINEL, POST_COMMIT_HOOK_NAME, PRE_COMMIT_HOOK_NAME, CANONICAL_METRICS, RESOLUTION_OUTCOMES, RELATIONSHIP_TYPES, BLOCK_KINDS, ANNOTATION_TYPES, ARCHIVE_REASONS;
var init_constants = __esm({
  "src/core/constants.ts"() {
    "use strict";
    WHYTHO_VERSION = "1.0";
    WHY_DIR = ".why";
    SESSIONS_DIR = "sessions";
    FOLDERS_DIR = "folders";
    FILES_DIR = "files";
    BLOCKS_DIR = "blocks";
    ARCHIVE_DIR = "archive";
    INDEX_FILE = "index.json";
    ARCHIVE_INDEX_FILE = "archive-index.json";
    ROOT_FOLDER_ANNOTATION = "root.md";
    PATH_SEPARATOR = "--";
    DEFAULT_CONFIDENCE_THRESHOLD = 0.3;
    DEFAULT_SUPERSEDED_THRESHOLD = 0.3;
    SEMANTIC_MATCH_MIN_CONFIDENCE = 0.7;
    DEFAULT_SEMANTIC_TIMEOUT_MS = 1e4;
    DEFAULT_AI_MODEL = "claude-opus-4-6";
    DEFAULT_AI_PROVIDER = "anthropic";
    HOOK_SENTINEL = "# whytho-hook-v1";
    POST_COMMIT_HOOK_NAME = "post-commit";
    PRE_COMMIT_HOOK_NAME = "pre-commit";
    CANONICAL_METRICS = [
      "symbolic",
      "line_range",
      "content_hash",
      "structural",
      "semantic_fingerprint",
      "none"
    ];
    RESOLUTION_OUTCOMES = [
      "RESOLVED",
      "RELOCATED",
      "RENAMED",
      "SPLIT",
      "MERGED",
      "DELETED",
      "SUPERSEDED",
      "UNRESOLVABLE"
    ];
    RELATIONSHIP_TYPES = [
      "extends",
      "overrides",
      "derived_from",
      "depends_on",
      "configures",
      "implements",
      "tests",
      "validates",
      "documents"
    ];
    BLOCK_KINDS = [
      "function",
      "method",
      "class",
      "interface",
      "type",
      "const",
      "config",
      "describe",
      "it",
      "test"
    ];
    ANNOTATION_TYPES = ["session", "folder", "file", "block"];
    ARCHIVE_REASONS = ["deleted", "superseded", "split", "merged"];
  }
});

// src/core/fs/layout.ts
function getWhyRoot(repoRoot) {
  return path.join(repoRoot, WHY_DIR);
}
function sessionsDir(whyRoot) {
  return path.join(whyRoot, SESSIONS_DIR);
}
function foldersDir(whyRoot) {
  return path.join(whyRoot, FOLDERS_DIR);
}
function filesDir(whyRoot) {
  return path.join(whyRoot, FILES_DIR);
}
function blocksDir(whyRoot) {
  return path.join(whyRoot, BLOCKS_DIR);
}
function archiveDir(whyRoot, type) {
  if (!type) return path.join(whyRoot, ARCHIVE_DIR);
  return path.join(whyRoot, ARCHIVE_DIR, `${type}s`);
}
function indexPath(whyRoot) {
  return path.join(whyRoot, INDEX_FILE);
}
function archiveIndexPath(whyRoot) {
  return path.join(whyRoot, ARCHIVE_INDEX_FILE);
}
function slugFromPath(sourcePath) {
  return sourcePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "").replace(/\//g, PATH_SEPARATOR);
}
function slugFromBlockRef(symbolicRef) {
  const [filePath, blockName] = symbolicRef.split("::");
  if (!blockName) return slugFromPath(filePath);
  const fileSlug = slugFromPath(filePath);
  const blockSlug = slugifyBlockName(blockName);
  return `${fileSlug}${PATH_SEPARATOR}${blockSlug}`;
}
function slugifyBlockName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function pathFromSlug(slug) {
  return slug.replace(new RegExp(PATH_SEPARATOR, "g"), "/");
}
function sessionAnnotationPath(whyRoot, sessionId) {
  return path.join(sessionsDir(whyRoot), `${sessionId}.md`);
}
function folderAnnotationPath(whyRoot, folderPath) {
  if (folderPath === "/" || folderPath === "") {
    return path.join(foldersDir(whyRoot), ROOT_FOLDER_ANNOTATION);
  }
  return path.join(foldersDir(whyRoot), `${slugFromPath(folderPath)}.md`);
}
function fileAnnotationPath(whyRoot, filePath) {
  return path.join(filesDir(whyRoot), `${slugFromPath(filePath)}.md`);
}
function blockAnnotationPath(whyRoot, symbolicRef) {
  return path.join(blocksDir(whyRoot), `${slugFromBlockRef(symbolicRef)}.md`);
}
async function safeArchivePath(basePath, exists) {
  if (!await exists(basePath)) return basePath;
  const ext = path.extname(basePath);
  const base = basePath.slice(0, -ext.length);
  for (let i = 2; i < 1e3; i++) {
    const candidate = `${base}-${i}${ext}`;
    if (!await exists(candidate)) return candidate;
  }
  throw new Error(`Could not find available archive path for ${basePath}`);
}
function parseSymbolicRef(ref) {
  const sep = ref.indexOf("::");
  if (sep === -1) throw new Error(`Invalid symbolic ref: ${ref}`);
  return { file: ref.slice(0, sep), block: ref.slice(sep + 2) };
}
function buildSymbolicRef(filePath, blockName) {
  return `${filePath}::${blockName}`;
}
function parentFolder(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const dir = normalized.substring(0, normalized.lastIndexOf("/") + 1);
  return dir || "/";
}
var path;
var init_layout = __esm({
  "src/core/fs/layout.ts"() {
    "use strict";
    path = __toESM(require("path"));
    init_constants();
  }
});

// src/core/frontmatter/parse.ts
function parseAnnotation(raw) {
  const { data, content } = (0, import_gray_matter.default)(raw);
  return {
    frontmatter: data,
    body: content.trim()
  };
}
var import_gray_matter;
var init_parse = __esm({
  "src/core/frontmatter/parse.ts"() {
    "use strict";
    import_gray_matter = __toESM(require("gray-matter"));
  }
});

// src/core/fs/reader.ts
var reader_exports = {};
__export(reader_exports, {
  readAllAnnotations: () => readAllAnnotations,
  readAllArchivedBlocks: () => readAllArchivedBlocks,
  readAllBlocks: () => readAllBlocks,
  readAllFiles: () => readAllFiles,
  readAllFolders: () => readAllFolders,
  readAllSessions: () => readAllSessions,
  readAnnotationFile: () => readAnnotationFile,
  readArchiveIndex: () => readArchiveIndex,
  readIndex: () => readIndex
});
async function readAnnotationFile(filePath) {
  const raw = await fs3.readFile(filePath, "utf8");
  const parsed = parseAnnotation(raw);
  return { ...parsed, filePath };
}
async function readAllAnnotations(dir) {
  let entries;
  try {
    entries = await fs3.readdir(dir);
  } catch {
    return [];
  }
  const results = [];
  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    const filePath = path4.join(dir, entry);
    try {
      const ann = await readAnnotationFile(filePath);
      results.push(ann);
    } catch {
    }
  }
  return results;
}
async function readAllBlocks(whyRoot) {
  return readAllAnnotations(blocksDir(whyRoot));
}
async function readAllFiles(whyRoot) {
  return readAllAnnotations(filesDir(whyRoot));
}
async function readAllFolders(whyRoot) {
  return readAllAnnotations(foldersDir(whyRoot));
}
async function readAllSessions(whyRoot) {
  return readAllAnnotations(sessionsDir(whyRoot));
}
async function readAllArchivedBlocks(whyRoot) {
  return readAllAnnotations(archiveDir(whyRoot, "block"));
}
async function readIndex(whyRoot) {
  const idxPath = path4.join(whyRoot, "index.json");
  try {
    const raw = await fs3.readFile(idxPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function readArchiveIndex(whyRoot) {
  const idxPath = path4.join(whyRoot, "archive-index.json");
  try {
    const raw = await fs3.readFile(idxPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
var fs3, path4;
var init_reader = __esm({
  "src/core/fs/reader.ts"() {
    "use strict";
    fs3 = __toESM(require("fs/promises"));
    path4 = __toESM(require("path"));
    init_parse();
    init_layout();
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BLOCK_KINDS: () => BLOCK_KINDS,
  BlockFrontmatterSchema: () => BlockFrontmatterSchema,
  BlockIdentitySchema: () => BlockIdentitySchema,
  CANONICAL_METRICS: () => CANONICAL_METRICS,
  DEFAULT_CONFIG: () => DEFAULT_CONFIG,
  FileFrontmatterSchema: () => FileFrontmatterSchema,
  FolderFrontmatterSchema: () => FolderFrontmatterSchema,
  RELATIONSHIP_TYPES: () => RELATIONSHIP_TYPES,
  RESOLUTION_OUTCOMES: () => RESOLUTION_OUTCOMES,
  RelationshipSchema: () => RelationshipSchema,
  SessionFrontmatterSchema: () => SessionFrontmatterSchema,
  ValidationError: () => ValidationError,
  WHYTHO_VERSION: () => WHYTHO_VERSION,
  archiveBlockAnnotation: () => archiveBlockAnnotation,
  archiveDir: () => archiveDir,
  archiveIndexPath: () => archiveIndexPath,
  blockAnnotationPath: () => blockAnnotationPath,
  blocksDir: () => blocksDir,
  buildHookEvent: () => buildHookEvent,
  buildIndex: () => buildIndex,
  buildSymbolicRef: () => buildSymbolicRef,
  computeContentHash: () => computeContentHash,
  createAnthropicProvider: () => createAnthropicProvider,
  detectLanguage: () => detectLanguage,
  electCanonicalMetric: () => electCanonicalMetric,
  emitHookEvents: () => emitHookEvents,
  fileAnnotationPath: () => fileAnnotationPath,
  fileExists: () => fileExists2,
  filesDir: () => filesDir,
  findArchivedBlocks: () => findArchivedBlocks,
  findRepoRoot: () => findRepoRoot,
  folderAnnotationPath: () => folderAnnotationPath,
  foldersDir: () => foldersDir,
  getAllRelated: () => getAllRelated,
  getBlockHistory: () => getBlockHistory,
  getChangedFiles: () => getChangedFiles,
  getCurrentUser: () => getCurrentUser,
  getDefaultProvider: () => getDefaultProvider,
  getDiffString: () => getDiffString,
  getHeadCommitSha: () => getHeadCommitSha,
  getPlugin: () => getPlugin,
  getProvider: () => getProvider,
  getRelationshipsFrom: () => getRelationshipsFrom,
  getRelationshipsTo: () => getRelationshipsTo,
  getWhyRoot: () => getWhyRoot,
  indexPath: () => indexPath,
  initWhyDir: () => initWhyDir,
  installHook: () => installHook,
  isHookInstalled: () => isHookInstalled,
  isTypeScriptOrJavaScript: () => isTypeScriptOrJavaScript,
  isWhyDirInitialized: () => isWhyDirInitialized,
  loadConfig: () => loadConfig,
  moveFile: () => moveFile,
  nullProvider: () => nullProvider,
  parentFolder: () => parentFolder,
  parseAnnotation: () => parseAnnotation,
  parseFile: () => parseFile,
  parseSymbolicRef: () => parseSymbolicRef,
  pathFromSlug: () => pathFromSlug,
  readAllArchivedBlocks: () => readAllArchivedBlocks,
  readAllBlocks: () => readAllBlocks,
  readAllFiles: () => readAllFiles,
  readAllFolders: () => readAllFolders,
  readAllSessions: () => readAllSessions,
  readAnnotationFile: () => readAnnotationFile,
  readIndex: () => readIndex,
  rebuildArchiveIndex: () => rebuildArchiveIndex,
  registerPlugin: () => registerPlugin,
  registerProvider: () => registerProvider,
  runResolutionPipeline: () => runResolutionPipeline,
  serializeAnnotation: () => serializeAnnotation,
  sessionAnnotationPath: () => sessionAnnotationPath,
  sessionsDir: () => sessionsDir,
  slugFromBlockRef: () => slugFromBlockRef,
  slugFromPath: () => slugFromPath,
  slugifyBlockName: () => slugifyBlockName,
  uninstallHook: () => uninstallHook,
  validateAnnotation: () => validateAnnotation,
  writeFile: () => writeFile3,
  writeJson: () => writeJson
});
module.exports = __toCommonJS(src_exports);

// src/core/types.ts
var import_zod = require("zod");
init_constants();
var StructuralPositionSchema = import_zod.z.object({
  kind: import_zod.z.enum(BLOCK_KINDS),
  parent_scope: import_zod.z.string(),
  name: import_zod.z.string(),
  parameters: import_zod.z.string().optional(),
  index_in_parent: import_zod.z.number().int().nonnegative()
});
var BlockIdentitySchema = import_zod.z.object({
  symbolic: import_zod.z.string(),
  line_range: import_zod.z.object({
    start: import_zod.z.number().int().positive(),
    end: import_zod.z.number().int().positive(),
    commit: import_zod.z.string()
  }),
  content_hash: import_zod.z.string().regex(/^sha256:[0-9a-f]{64}$/),
  structural: StructuralPositionSchema,
  semantic_fingerprint: import_zod.z.string(),
  canonical_metric: import_zod.z.enum(CANONICAL_METRICS),
  confidence: import_zod.z.number().min(0).max(1),
  last_resolved: import_zod.z.string()
});
var RelationshipSchema = import_zod.z.object({
  type: import_zod.z.enum(RELATIONSHIP_TYPES),
  target: import_zod.z.string(),
  description: import_zod.z.string().optional(),
  bidirectional: import_zod.z.boolean().optional()
});
var BaseAnnotationSchema = import_zod.z.object({
  whytho: import_zod.z.literal("1.0"),
  type: import_zod.z.enum(ANNOTATION_TYPES),
  created: import_zod.z.string(),
  updated: import_zod.z.string()
});
var SessionCommitSchema = import_zod.z.object({
  sha: import_zod.z.string(),
  message: import_zod.z.string(),
  timestamp: import_zod.z.string()
});
var SessionFrontmatterSchema = BaseAnnotationSchema.extend({
  type: import_zod.z.literal("session"),
  id: import_zod.z.string(),
  model: import_zod.z.string(),
  commits: import_zod.z.array(SessionCommitSchema),
  files_touched: import_zod.z.array(import_zod.z.string()),
  ended: import_zod.z.string().optional(),
  model_provider: import_zod.z.string().optional(),
  user: import_zod.z.string().optional(),
  folders_touched: import_zod.z.array(import_zod.z.string()).optional(),
  blocks_touched: import_zod.z.array(import_zod.z.string()).optional(),
  tags: import_zod.z.array(import_zod.z.string()).optional()
});
var FolderFrontmatterSchema = BaseAnnotationSchema.extend({
  type: import_zod.z.literal("folder"),
  path: import_zod.z.string(),
  updated_by_session: import_zod.z.string(),
  parent_folder: import_zod.z.string().optional(),
  contained_files: import_zod.z.array(import_zod.z.string()).optional(),
  sessions: import_zod.z.array(import_zod.z.string()).optional()
});
var FileFrontmatterSchema = BaseAnnotationSchema.extend({
  type: import_zod.z.literal("file"),
  path: import_zod.z.string(),
  updated_by_session: import_zod.z.string(),
  parent_folder: import_zod.z.string(),
  sessions: import_zod.z.array(import_zod.z.string()).optional(),
  blocks: import_zod.z.array(import_zod.z.string()).optional(),
  language: import_zod.z.string().optional()
});
var BlockFrontmatterSchema = BaseAnnotationSchema.extend({
  type: import_zod.z.literal("block"),
  symbolic_ref: import_zod.z.string(),
  file: import_zod.z.string(),
  created_by_session: import_zod.z.string(),
  updated_by_session: import_zod.z.string(),
  identity: BlockIdentitySchema,
  relationships: import_zod.z.array(RelationshipSchema).optional(),
  derived_from: import_zod.z.string().optional(),
  parents: import_zod.z.array(import_zod.z.string()).optional(),
  resolution_status: import_zod.z.string().optional(),
  archived_at: import_zod.z.string().optional(),
  archived_reason: import_zod.z.enum(ARCHIVE_REASONS).optional(),
  archived_by_session: import_zod.z.string().optional(),
  archived_at_commit: import_zod.z.string().optional()
});

// src/index.ts
init_constants();
init_layout();

// src/core/fs/init.ts
var fs = __toESM(require("fs/promises"));
var path2 = __toESM(require("path"));
init_layout();
init_constants();
var EMPTY_INDEX = {
  whytho_version: WHYTHO_VERSION,
  generated_at: (/* @__PURE__ */ new Date()).toISOString(),
  generated_at_commit: "",
  sessions: {},
  folders: {},
  files: {},
  blocks: {},
  relationships: [],
  unresolved: []
};
var EMPTY_ARCHIVE_INDEX = {
  whytho_version: WHYTHO_VERSION,
  generated_at: (/* @__PURE__ */ new Date()).toISOString(),
  sessions: {},
  folders: {},
  files: {},
  blocks: {}
};
async function initWhyDir(repoRoot) {
  const whyRoot = getWhyRoot(repoRoot);
  const dirs = [
    whyRoot,
    sessionsDir(whyRoot),
    foldersDir(whyRoot),
    filesDir(whyRoot),
    blocksDir(whyRoot),
    archiveDir(whyRoot),
    path2.join(whyRoot, "archive", "sessions"),
    path2.join(whyRoot, "archive", "folders"),
    path2.join(whyRoot, "archive", "files"),
    path2.join(whyRoot, "archive", "blocks")
  ];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  const idxPath = indexPath(whyRoot);
  if (!await fileExists(idxPath)) {
    await fs.writeFile(idxPath, JSON.stringify(EMPTY_INDEX, null, 2) + "\n", "utf8");
  }
  const archIdxPath = archiveIndexPath(whyRoot);
  if (!await fileExists(archIdxPath)) {
    await fs.writeFile(archIdxPath, JSON.stringify(EMPTY_ARCHIVE_INDEX, null, 2) + "\n", "utf8");
  }
}
async function isWhyDirInitialized(repoRoot) {
  const whyRoot = getWhyRoot(repoRoot);
  try {
    await fs.access(whyRoot);
    await fs.access(indexPath(whyRoot));
    return true;
  } catch {
    return false;
  }
}
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// src/core/fs/writer.ts
var fs2 = __toESM(require("fs/promises"));
var path3 = __toESM(require("path"));
async function writeFile3(filePath, content) {
  await fs2.mkdir(path3.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.whytho-tmp`;
  await fs2.writeFile(tmp, content, "utf8");
  await fs2.rename(tmp, filePath);
}
async function writeJson(filePath, data) {
  await writeFile3(filePath, JSON.stringify(data, null, 2) + "\n");
}
async function fileExists2(filePath) {
  try {
    await fs2.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function moveFile(src, dest) {
  await fs2.mkdir(path3.dirname(dest), { recursive: true });
  try {
    await fs2.rename(src, dest);
  } catch {
    await fs2.copyFile(src, dest);
    await fs2.unlink(src);
  }
}

// src/index.ts
init_reader();
init_parse();

// src/core/frontmatter/serialize.ts
var yaml = __toESM(require("js-yaml"));
function serializeAnnotation(frontmatter, body) {
  const yamlStr = yaml.dump(frontmatter, {
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false,
    noRefs: true
  });
  return `---
${yamlStr}---

${body}
`;
}

// src/core/frontmatter/validate.ts
var import_zod2 = require("zod");
var ValidationError = class extends Error {
  constructor(message, issues) {
    super(message);
    this.issues = issues;
    this.name = "ValidationError";
  }
};
function validateAnnotation(data) {
  const obj = data;
  const type = obj?.type;
  try {
    switch (type) {
      case "session":
        return SessionFrontmatterSchema.parse(data);
      case "folder":
        return FolderFrontmatterSchema.parse(data);
      case "file":
        return FileFrontmatterSchema.parse(data);
      case "block":
        return BlockFrontmatterSchema.parse(data);
      default:
        throw new ValidationError(`Unknown annotation type: ${String(type)}`, []);
    }
  } catch (err) {
    if (err instanceof import_zod2.ZodError) {
      throw new ValidationError(`Validation failed for ${String(type)} annotation`, err.issues);
    }
    throw err;
  }
}

// src/core/parser/registry.ts
var path5 = __toESM(require("path"));

// src/core/parser/plugins/generic.ts
var PATTERNS = [
  // function declarations
  {
    kind: "function",
    pattern: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*(\([^)]*\))/m,
    nameGroup: 1,
    paramsGroup: 2
  },
  // arrow function assigned to const
  {
    kind: "function",
    pattern: /^(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/m,
    nameGroup: 1,
    paramsGroup: 2
  },
  // class declarations
  {
    kind: "class",
    pattern: /^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/m,
    nameGroup: 1
  },
  // interface declarations
  {
    kind: "interface",
    pattern: /^(?:export\s+)?interface\s+(\w+)/m,
    nameGroup: 1
  },
  // type aliases
  {
    kind: "type",
    pattern: /^(?:export\s+)?type\s+(\w+)\s*=/m,
    nameGroup: 1
  },
  // const declarations (top-level)
  {
    kind: "const",
    pattern: /^(?:export\s+)?const\s+(\w+)\s*[=:]/m,
    nameGroup: 1
  },
  // describe blocks (test files)
  {
    kind: "describe",
    pattern: /^(?:export\s+)?describe\s*\(\s*['"`]([^'"`]+)['"`]/m,
    nameGroup: 1
  },
  // it/test blocks
  {
    kind: "it",
    pattern: /^\s*(?:it|test)\s*\(\s*['"`]([^'"`]+)['"`]/m,
    nameGroup: 1
  }
];
var genericPlugin = {
  name: "generic",
  extensions: ["*"],
  parse(source, _filePath) {
    const lines = source.split("\n");
    const blocks = [];
    const kindCounts = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of PATTERNS) {
        const match = line.match(pattern.pattern);
        if (!match) continue;
        const name = match[pattern.nameGroup];
        if (!name) continue;
        const params = pattern.paramsGroup ? match[pattern.paramsGroup] : void 0;
        const endLine = findBlockEnd(lines, i);
        const count = kindCounts[pattern.kind] ?? 0;
        kindCounts[pattern.kind] = count + 1;
        blocks.push({
          kind: pattern.kind,
          name,
          parentScope: "module",
          parameters: params ? `(${params})` : void 0,
          indexInParent: count,
          startLine: i + 1,
          endLine,
          content: lines.slice(i, endLine).join("\n")
        });
        break;
      }
    }
    return blocks;
  }
};
function findBlockEnd(lines, startIdx) {
  const topLevelPattern = /^(?:export\s+)?(?:(?:async\s+)?function|class|interface|type|const|let|var|describe|it|test)\s/;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].match(topLevelPattern)) {
      return i;
    }
  }
  return lines.length;
}

// src/core/parser/plugins/typescript.ts
var cachedEstree = void 0;
function getEstree() {
  if (cachedEstree !== void 0) return cachedEstree;
  try {
    cachedEstree = require("@typescript-eslint/typescript-estree");
  } catch {
    cachedEstree = null;
  }
  return cachedEstree;
}
function nextCount(ctx, kind) {
  const n = ctx.kindCounts[kind] ?? 0;
  ctx.kindCounts[kind] = n + 1;
  return n;
}
function extractContent(ctx, start, end) {
  return ctx.lines.slice(start - 1, end).join("\n");
}
function visitNode(node, ctx) {
  if (!node || !node.type) return;
  const startLine = node.loc?.start.line ?? 0;
  const endLine = node.loc?.end.line ?? 0;
  const parentScope = ctx.scopeStack[ctx.scopeStack.length - 1] ?? "module";
  switch (node.type) {
    case "FunctionDeclaration": {
      const name = node.id?.name;
      if (name) {
        const params = extractParams(node);
        ctx.blocks.push({
          kind: "function",
          name,
          parentScope,
          parameters: params,
          indexInParent: nextCount(ctx, "function"),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
      }
      break;
    }
    case "VariableDeclaration": {
      if (!node.declarations) break;
      for (const decl of node.declarations) {
        const id = decl.id;
        const init = decl.init;
        if (!id || id.type !== "Identifier") continue;
        const varName = id.name;
        if (!varName) continue;
        if (init && (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression")) {
          ctx.blocks.push({
            kind: "function",
            name: varName,
            parentScope,
            parameters: extractParams(init),
            indexInParent: nextCount(ctx, "function"),
            startLine: node.loc?.start.line ?? 0,
            endLine: node.loc?.end.line ?? 0,
            content: extractContent(ctx, node.loc?.start.line ?? 0, node.loc?.end.line ?? 0)
          });
        } else if (parentScope === "module") {
          ctx.blocks.push({
            kind: "const",
            name: varName,
            parentScope,
            indexInParent: nextCount(ctx, "const"),
            startLine: node.loc?.start.line ?? 0,
            endLine: node.loc?.end.line ?? 0,
            content: extractContent(ctx, node.loc?.start.line ?? 0, node.loc?.end.line ?? 0)
          });
        }
      }
      break;
    }
    case "ClassDeclaration":
    case "ClassExpression": {
      const name = node.id?.name;
      if (name) {
        ctx.blocks.push({
          kind: "class",
          name,
          parentScope,
          indexInParent: nextCount(ctx, "class"),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
        ctx.scopeStack.push(name);
        visitChildren(node, ctx);
        ctx.scopeStack.pop();
        return;
      }
      break;
    }
    case "MethodDefinition": {
      const key = node.key;
      const name = key?.name ?? (key?.type === "Literal" ? String(key.value ?? "") : void 0);
      if (name) {
        ctx.blocks.push({
          kind: "method",
          name,
          parentScope,
          parameters: extractParams(node.value),
          indexInParent: nextCount(ctx, "method"),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
      }
      break;
    }
    case "TSInterfaceDeclaration": {
      const name = node.id?.name;
      if (name) {
        ctx.blocks.push({
          kind: "interface",
          name,
          parentScope,
          indexInParent: nextCount(ctx, "interface"),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
      }
      break;
    }
    case "TSTypeAliasDeclaration": {
      const name = node.id?.name;
      if (name) {
        ctx.blocks.push({
          kind: "type",
          name,
          parentScope,
          indexInParent: nextCount(ctx, "type"),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
      }
      break;
    }
    case "ExpressionStatement": {
      const expr = node.expression;
      if (!expr || expr.type !== "CallExpression") break;
      const callee = expr.callee;
      const calleeName = callee?.name ?? (callee?.type === "Identifier" ? callee.name : void 0);
      if (!calleeName) break;
      const args = expr.arguments;
      const firstArg = args?.[0];
      const testName = firstArg?.type === "Literal" ? String(firstArg.value ?? "") : firstArg?.type === "TemplateLiteral" ? "[template]" : void 0;
      if (calleeName === "describe" && testName) {
        ctx.blocks.push({
          kind: "describe",
          name: `describe(${testName})`,
          parentScope,
          indexInParent: nextCount(ctx, "describe"),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
        return;
      }
      if ((calleeName === "it" || calleeName === "test") && testName) {
        const kind = calleeName === "it" ? "it" : "test";
        ctx.blocks.push({
          kind,
          name: `${calleeName}(${testName})`,
          parentScope,
          indexInParent: nextCount(ctx, kind),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine)
        });
        return;
      }
      break;
    }
  }
  visitChildren(node, ctx);
}
function visitChildren(node, ctx) {
  for (const val of Object.values(node)) {
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (const child of val) {
          if (child && typeof child === "object" && "type" in child) {
            visitNode(child, ctx);
          }
        }
      } else if ("type" in val) {
        visitNode(val, ctx);
      }
    }
  }
}
function extractParams(node) {
  if (!node || !node.params) return "()";
  return `(${node.params.length} params)`;
}
var typescriptPlugin = {
  name: "typescript",
  extensions: [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"],
  parse(source, filePath) {
    const estree = getEstree();
    if (!estree) {
      return genericPlugin.parse(source, filePath);
    }
    try {
      const ast = estree.parse(source, {
        jsx: filePath.endsWith("x"),
        loc: true,
        range: false,
        comment: false,
        tokens: false,
        errorOnUnknownASTType: false
      });
      const lines = source.split("\n");
      const ctx = {
        lines,
        source,
        blocks: [],
        kindCounts: {},
        scopeStack: ["module"]
      };
      for (const node of ast.body ?? []) {
        visitNode(node, ctx);
      }
      return ctx.blocks;
    } catch {
      return genericPlugin.parse(source, filePath);
    }
  }
};

// src/core/parser/registry.ts
var plugins = [typescriptPlugin];
function registerPlugin(plugin) {
  plugins.unshift(plugin);
}
function getPlugin(filePath) {
  const ext = path5.extname(filePath).toLowerCase();
  for (const plugin of plugins) {
    if (plugin.extensions.includes(ext)) return plugin;
  }
  return genericPlugin;
}
function parseFile(source, filePath) {
  const plugin = getPlugin(filePath);
  return plugin.parse(source, filePath);
}

// src/core/parser/detect-language.ts
var path6 = __toESM(require("path"));
var EXT_TO_LANGUAGE = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".mts": "typescript",
  ".cts": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".py": "python",
  ".rb": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".java": "java",
  ".cs": "csharp",
  ".cpp": "cpp",
  ".c": "c",
  ".php": "php",
  ".swift": "swift",
  ".kt": "kotlin"
};
function detectLanguage(filePath) {
  const ext = path6.extname(filePath).toLowerCase();
  return EXT_TO_LANGUAGE[ext] ?? "unknown";
}
function isTypeScriptOrJavaScript(filePath) {
  const lang = detectLanguage(filePath);
  return lang === "typescript" || lang === "javascript";
}

// src/core/identity/content-hash.ts
var import_crypto = require("crypto");
function computeContentHash(blockContent) {
  const normalized = blockContent.trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const hex = (0, import_crypto.createHash)("sha256").update(normalized, "utf8").digest("hex");
  return `sha256:${hex}`;
}

// src/core/identity/election.ts
init_constants();
function structuralMatch(stored, candidate) {
  return stored.kind === candidate.kind && stored.parent_scope === candidate.parentScope && stored.name === candidate.name;
}
function symbolicResolves(storedSymbolic, candidates, filePath) {
  const blockName = storedSymbolic.split("::")[1];
  if (!blockName) return void 0;
  return candidates.find((c) => c.name === blockName);
}
async function electCanonicalMetric(input, ai) {
  const { stored, candidates, filePath, commitSha, source } = input;
  const candidateHashes = candidates.map((c) => computeContentHash(c.content));
  const symbolicBlock = symbolicResolves(stored.symbolic, candidates, filePath);
  if (symbolicBlock) {
    if (structuralMatch(stored.structural, symbolicBlock)) {
      const newHash = computeContentHash(symbolicBlock.content);
      return {
        outcome: "RESOLVED",
        canonical_metric: "symbolic",
        confidence: 0.95,
        matchedBlock: symbolicBlock,
        updatedIdentity: {
          symbolic: stored.symbolic,
          line_range: { start: symbolicBlock.startLine, end: symbolicBlock.endLine, commit: commitSha },
          content_hash: newHash,
          canonical_metric: "symbolic",
          confidence: 0.95,
          last_resolved: commitSha
        }
      };
    }
  }
  const hashMatchIdx = candidateHashes.findIndex((h) => h === stored.content_hash);
  if (hashMatchIdx !== -1) {
    const hashBlock = candidates[hashMatchIdx];
    if (structuralMatch(stored.structural, hashBlock)) {
      const newSymbolic = `${filePath}::${hashBlock.name}`;
      return {
        outcome: symbolicBlock ? "RESOLVED" : "RELOCATED",
        canonical_metric: "structural",
        confidence: 0.9,
        matchedBlock: hashBlock,
        updatedIdentity: {
          symbolic: newSymbolic,
          line_range: { start: hashBlock.startLine, end: hashBlock.endLine, commit: commitSha },
          content_hash: stored.content_hash,
          canonical_metric: "structural",
          confidence: 0.9,
          last_resolved: commitSha
        }
      };
    }
  }
  const structuralMatchBlock = candidates.find((c) => structuralMatch(stored.structural, c));
  if (structuralMatchBlock) {
    const newHash = computeContentHash(structuralMatchBlock.content);
    const newSymbolic = `${filePath}::${structuralMatchBlock.name}`;
    return {
      outcome: "RESOLVED",
      canonical_metric: "structural",
      confidence: 0.75,
      matchedBlock: structuralMatchBlock,
      updatedIdentity: {
        symbolic: newSymbolic,
        line_range: {
          start: structuralMatchBlock.startLine,
          end: structuralMatchBlock.endLine,
          commit: commitSha
        },
        content_hash: newHash,
        canonical_metric: "structural",
        confidence: 0.75,
        last_resolved: commitSha
      }
    };
  }
  if (ai && stored.semantic_fingerprint && candidates.length > 0) {
    try {
      const result = await Promise.race([
        ai.matchSemanticFingerprint({
          fingerprint: stored.semantic_fingerprint,
          candidates: candidates.map((c) => ({ block: c, source: c.content }))
        }),
        new Promise(
          (resolve3) => setTimeout(() => resolve3(null), DEFAULT_SEMANTIC_TIMEOUT_MS)
        )
      ]);
      if (result !== null && result.matchedIndex !== null && result.confidence >= SEMANTIC_MATCH_MIN_CONFIDENCE) {
        const matched = candidates[result.matchedIndex];
        const newHash = computeContentHash(matched.content);
        const newSymbolic = `${filePath}::${matched.name}`;
        return {
          outcome: "RESOLVED",
          canonical_metric: "semantic_fingerprint",
          confidence: result.confidence * 0.8,
          // Slight discount for AI matching
          matchedBlock: matched,
          updatedIdentity: {
            symbolic: newSymbolic,
            line_range: { start: matched.startLine, end: matched.endLine, commit: commitSha },
            content_hash: newHash,
            structural: {
              kind: matched.kind,
              parent_scope: matched.parentScope,
              name: matched.name,
              parameters: matched.parameters,
              index_in_parent: matched.indexInParent
            },
            canonical_metric: "semantic_fingerprint",
            confidence: result.confidence * 0.8,
            last_resolved: commitSha
          }
        };
      }
    } catch {
    }
  }
  if (candidates.length === 0) {
    return {
      outcome: "DELETED",
      canonical_metric: "none",
      confidence: 0
    };
  }
  return {
    outcome: "UNRESOLVABLE",
    canonical_metric: "none",
    confidence: 0
  };
}

// src/core/resolution/pipeline.ts
var fs5 = __toESM(require("fs/promises"));
init_layout();

// src/core/archive/archiver.ts
var path7 = __toESM(require("path"));
init_reader();
init_layout();
async function archiveBlockAnnotation(whyRoot, symbolicRef, options) {
  const sourcePath = blockAnnotationPath(whyRoot, symbolicRef);
  if (!await fileExists2(sourcePath)) {
    return null;
  }
  const ann = await readAnnotationFile(sourcePath);
  const fm = ann.frontmatter;
  const archivedFm = {
    ...fm,
    archived_at: (/* @__PURE__ */ new Date()).toISOString(),
    archived_reason: options.reason,
    archived_by_session: options.bySession,
    archived_at_commit: options.atCommit
  };
  const archiveBasePath = path7.join(
    archiveDir(whyRoot, "block"),
    `${slugFromBlockRef(symbolicRef)}.md`
  );
  const destPath = await safeArchivePath(archiveBasePath, fileExists2);
  await writeFile3(destPath, serializeAnnotation(archivedFm, ann.body));
  const { unlink: unlink4 } = await import("fs/promises");
  await unlink4(sourcePath);
  return destPath;
}

// src/core/relationships/events.ts
var fs4 = __toESM(require("fs/promises"));
var path8 = __toESM(require("path"));
var https = __toESM(require("https"));
init_constants();
function buildHookEvent(params) {
  return {
    event: "relationship_target_changed",
    whytho_version: WHYTHO_VERSION,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    commit: params.commit,
    session: params.session,
    relationship: {
      type: params.relationshipType,
      source: params.source,
      target: params.target
    },
    change: {
      type: params.changeType,
      target_resolution: params.targetResolution,
      target_previous_hash: params.targetPreviousHash,
      target_current_hash: params.targetCurrentHash,
      target_confidence: params.targetConfidence
    }
  };
}
async function emitHookEvents(events, config, repoRoot) {
  if (events.length === 0) return;
  const tasks = [];
  if (config.hooks.onRelationshipChanged) {
    tasks.push(writeEventsToFile(events, config.hooks.onRelationshipChanged, repoRoot));
  }
  if (config.hooks.webhookUrl) {
    tasks.push(postEventsToWebhook(events, config.hooks.webhookUrl));
  }
  if (!config.hooks.onRelationshipChanged && !config.hooks.webhookUrl) {
    const eventsFile = path8.join(repoRoot, ".why", "events.ndjson");
    tasks.push(appendEventsToFile(events, eventsFile));
  }
  await Promise.allSettled(tasks);
}
async function writeEventsToFile(events, scriptPath, repoRoot) {
  const { spawn } = await import("child_process");
  const input = events.map((e) => JSON.stringify(e)).join("\n");
  const resolvedScript = path8.resolve(repoRoot, scriptPath);
  await new Promise((resolve3) => {
    const proc = spawn(resolvedScript, [], { stdio: ["pipe", "inherit", "inherit"] });
    proc.stdin.write(input);
    proc.stdin.end();
    const timer = setTimeout(() => {
      proc.kill();
      resolve3();
    }, 1e4);
    proc.on("close", () => {
      clearTimeout(timer);
      resolve3();
    });
    proc.on("error", () => {
      clearTimeout(timer);
      resolve3();
    });
  });
}
async function postEventsToWebhook(events, webhookUrl) {
  const body = JSON.stringify(events);
  return new Promise((resolve3) => {
    try {
      const url = new URL(webhookUrl);
      const req = https.request(
        {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: "POST",
          headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
        },
        () => resolve3()
      );
      req.on("error", () => resolve3());
      req.setTimeout(1e4, () => {
        req.destroy();
        resolve3();
      });
      req.write(body);
      req.end();
    } catch {
      resolve3();
    }
  });
}
async function appendEventsToFile(events, filePath) {
  const lines = events.map((e) => JSON.stringify(e)).join("\n") + "\n";
  await fs4.appendFile(filePath, lines, "utf8");
}

// src/core/resolution/incremental.ts
init_reader();
async function getBlocksForChangedFiles(whyRoot, changedFiles) {
  if (changedFiles.length === 0) return [];
  const allBlocks = await readAllBlocks(whyRoot);
  const changedSet = new Set(changedFiles.map((f) => f.replace(/\\/g, "/")));
  return allBlocks.filter((ann) => changedSet.has(ann.frontmatter.file.replace(/\\/g, "/")));
}

// src/core/resolution/pipeline.ts
async function runResolutionPipeline(ctx) {
  const { whyRoot, repoRoot, commitSha, changedFiles, sessionId, config, ai } = ctx;
  const threshold = config.resolution.confidenceThreshold;
  const blocksToProcess = await getBlocksForChangedFiles(whyRoot, changedFiles);
  const outcomes = {};
  const hookEvents = [];
  const errors = {};
  const previousHashes = {};
  const currentHashes = {};
  for (const ann of blocksToProcess) {
    previousHashes[ann.frontmatter.symbolic_ref] = ann.frontmatter.identity.content_hash;
  }
  for (const ann of blocksToProcess) {
    const fm = ann.frontmatter;
    const symbolicRef = fm.symbolic_ref;
    const filePath = fm.file;
    try {
      let source;
      try {
        source = await fs5.readFile(`${repoRoot}/${filePath}`, "utf8");
      } catch {
        await archiveBlockAnnotation(whyRoot, symbolicRef, {
          reason: "deleted",
          bySession: sessionId ?? "unknown",
          atCommit: commitSha
        });
        outcomes[symbolicRef] = "DELETED";
        currentHashes[symbolicRef] = "";
        continue;
      }
      const candidates = parseFile(source, filePath);
      const electionResult = await electCanonicalMetric(
        { stored: fm.identity, candidates, filePath, commitSha, source },
        ai
      );
      const { outcome, matchedBlock, updatedIdentity, confidence, canonical_metric } = electionResult;
      currentHashes[symbolicRef] = matchedBlock ? computeContentHash(matchedBlock.content) : "";
      if (outcome === "DELETED" || outcome === "UNRESOLVABLE" && !matchedBlock) {
        if (outcome === "DELETED") {
          await archiveBlockAnnotation(whyRoot, symbolicRef, {
            reason: "deleted",
            bySession: sessionId ?? "unknown",
            atCommit: commitSha
          });
        } else {
          const frozenFm = {
            ...fm,
            resolution_status: "unresolvable",
            identity: {
              ...fm.identity,
              confidence: 0,
              canonical_metric: "none",
              last_resolved: commitSha
            }
          };
          await writeFile3(ann.filePath, serializeAnnotation(frozenFm, ann.body));
        }
        outcomes[symbolicRef] = outcome;
        continue;
      }
      if (outcome === "SUPERSEDED") {
        await archiveBlockAnnotation(whyRoot, symbolicRef, {
          reason: "superseded",
          bySession: sessionId ?? "unknown",
          atCommit: commitSha
        });
        const stubFm = {
          ...fm,
          updated: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by_session: sessionId ?? fm.updated_by_session,
          identity: {
            ...fm.identity,
            ...updatedIdentity,
            canonical_metric,
            confidence,
            last_resolved: commitSha
          },
          resolution_status: "re-annotation-needed",
          derived_from: symbolicRef
        };
        await writeFile3(ann.filePath, serializeAnnotation(stubFm, "## Purpose\n\n[Re-annotation needed after superseding change.]\n"));
        outcomes[symbolicRef] = "SUPERSEDED";
        continue;
      }
      const newFm = {
        ...fm,
        updated: (/* @__PURE__ */ new Date()).toISOString(),
        updated_by_session: sessionId ?? fm.updated_by_session,
        identity: {
          ...fm.identity,
          ...updatedIdentity,
          canonical_metric,
          confidence,
          last_resolved: commitSha
        }
      };
      if (updatedIdentity?.symbolic && updatedIdentity.symbolic !== symbolicRef) {
        newFm.symbolic_ref = updatedIdentity.symbolic;
        newFm.file = filePath;
        const newPath = blockAnnotationPath(whyRoot, updatedIdentity.symbolic);
        await writeFile3(newPath, serializeAnnotation(newFm, ann.body));
        if (newPath !== ann.filePath) {
          try {
            await fs5.unlink(ann.filePath);
          } catch {
          }
        }
      } else {
        await writeFile3(ann.filePath, serializeAnnotation(newFm, ann.body));
      }
      outcomes[symbolicRef] = outcome;
    } catch (err) {
      errors[symbolicRef] = String(err);
      outcomes[symbolicRef] = "UNRESOLVABLE";
    }
  }
  const allBlocks = await getBlocksForChangedFiles(whyRoot, changedFiles);
  for (const ann of allBlocks) {
    const rels = ann.frontmatter.relationships ?? [];
    for (const rel of rels) {
      const targetRef = rel.target;
      const targetOutcome = outcomes[targetRef];
      if (!targetOutcome) continue;
      const prevHash = previousHashes[targetRef];
      const currHash = currentHashes[targetRef];
      const hashChanged = prevHash && currHash && prevHash !== currHash;
      if (targetOutcome !== "RESOLVED" || hashChanged) {
        hookEvents.push(
          buildHookEvent({
            commit: commitSha,
            session: sessionId,
            relationshipType: rel.type,
            source: ann.frontmatter.symbolic_ref,
            target: targetRef,
            changeType: targetOutcome.toLowerCase(),
            targetResolution: targetOutcome,
            targetPreviousHash: prevHash,
            targetCurrentHash: currHash,
            targetConfidence: 0
          })
        );
      }
    }
  }
  return {
    processedBlocks: blocksToProcess.length,
    outcomes,
    hookEvents,
    errors
  };
}

// src/core/index-builder/build.ts
init_reader();
init_layout();
init_constants();
async function buildIndex(whyRoot, commitSha) {
  const [blockAnns, fileAnns, folderAnns, sessionAnns] = await Promise.all([
    readAllBlocks(whyRoot),
    readAllFiles(whyRoot),
    readAllFolders(whyRoot),
    readAllSessions(whyRoot)
  ]);
  const sessions = {};
  for (const ann of sessionAnns) {
    const fm = ann.frontmatter;
    sessions[fm.id] = {
      id: fm.id,
      created: fm.created,
      folders_touched: fm.folders_touched ?? [],
      files_touched: fm.files_touched,
      blocks_touched: fm.blocks_touched ?? [],
      commits: fm.commits.map((c) => c.sha)
    };
  }
  const folders = {};
  for (const ann of folderAnns) {
    const fm = ann.frontmatter;
    folders[fm.path] = {
      path: fm.path,
      parent_folder: fm.parent_folder,
      contained_files: fm.contained_files ?? [],
      sessions: fm.sessions ?? []
    };
  }
  const files = {};
  for (const ann of fileAnns) {
    const fm = ann.frontmatter;
    files[fm.path] = {
      path: fm.path,
      parent_folder: fm.parent_folder,
      blocks: fm.blocks ?? [],
      sessions: fm.sessions ?? []
    };
  }
  const blocks = {};
  const relationships = [];
  const unresolved = [];
  for (const ann of blockAnns) {
    const fm = ann.frontmatter;
    const rels = fm.relationships ?? [];
    const relsOut = rels.map((r) => ({ type: r.type, target: r.target }));
    blocks[fm.symbolic_ref] = {
      symbolic_ref: fm.symbolic_ref,
      file: fm.file,
      canonical_metric: fm.identity.canonical_metric,
      confidence: fm.identity.confidence,
      last_resolved: fm.identity.last_resolved,
      content_hash: fm.identity.content_hash,
      created_by_session: fm.created_by_session,
      updated_by_session: fm.updated_by_session,
      relationships_out: relsOut,
      relationships_in: []
      // populated below
    };
    for (const rel of rels) {
      relationships.push({ type: rel.type, source: fm.symbolic_ref, target: rel.target });
    }
    if (fm.resolution_status === "unresolvable") {
      unresolved.push(fm.symbolic_ref);
    }
  }
  for (const edge of relationships) {
    const target = blocks[edge.target];
    if (target) {
      target.relationships_in.push({ type: edge.type, source: edge.source });
    }
  }
  const index = {
    whytho_version: WHYTHO_VERSION,
    generated_at: (/* @__PURE__ */ new Date()).toISOString(),
    generated_at_commit: commitSha,
    sessions,
    folders,
    files,
    blocks,
    relationships,
    unresolved
  };
  await writeJson(indexPath(whyRoot), index);
  return index;
}
async function rebuildArchiveIndex(whyRoot) {
  const { readAllArchivedBlocks: readAllArchivedBlocks2 } = await Promise.resolve().then(() => (init_reader(), reader_exports));
  const archivedBlocks = await readAllArchivedBlocks2(whyRoot);
  const blocks = {};
  for (const ann of archivedBlocks) {
    const fm = ann.frontmatter;
    blocks[fm.symbolic_ref] = {
      symbolic_ref: fm.symbolic_ref,
      file: fm.file,
      canonical_metric: fm.identity.canonical_metric,
      confidence: fm.identity.confidence,
      last_resolved: fm.identity.last_resolved,
      content_hash: fm.identity.content_hash,
      created_by_session: fm.created_by_session,
      updated_by_session: fm.updated_by_session,
      relationships_out: (fm.relationships ?? []).map((r) => ({ type: r.type, target: r.target })),
      relationships_in: [],
      archived_at: fm.archived_at ?? (/* @__PURE__ */ new Date()).toISOString(),
      archived_reason: fm.archived_reason ?? "deleted",
      archived_by_session: fm.archived_by_session ?? "unknown",
      archived_at_commit: fm.archived_at_commit ?? "",
      last_known_confidence: fm.identity.confidence,
      last_known_content_hash: fm.identity.content_hash
    };
  }
  const archiveIndex = {
    whytho_version: WHYTHO_VERSION,
    generated_at: (/* @__PURE__ */ new Date()).toISOString(),
    sessions: {},
    folders: {},
    files: {},
    blocks
  };
  await writeJson(archiveIndexPath(whyRoot), archiveIndex);
  return archiveIndex;
}

// src/core/archive/query.ts
init_reader();
async function findArchivedBlocks(whyRoot, symbolicRef) {
  const all = await readAllArchivedBlocks(whyRoot);
  return all.filter((a) => {
    const ref = a.frontmatter.symbolic_ref;
    return ref === symbolicRef || ref.startsWith(symbolicRef);
  });
}
async function getBlockHistory(whyRoot, symbolicRef) {
  return findArchivedBlocks(whyRoot, symbolicRef);
}

// src/core/relationships/graph.ts
function getRelationshipsFrom(index, symbolicRef) {
  return index.relationships.filter((r) => r.source === symbolicRef);
}
function getRelationshipsTo(index, symbolicRef) {
  return index.relationships.filter((r) => r.target === symbolicRef);
}
function getAllRelated(index, symbolicRef) {
  const out = getRelationshipsFrom(index, symbolicRef).map((edge) => ({ direction: "out", edge }));
  const inn = getRelationshipsTo(index, symbolicRef).map((edge) => ({ direction: "in", edge }));
  return [...out, ...inn];
}

// src/core/git/repo.ts
var import_simple_git = require("simple-git");
async function findRepoRoot(startDir = process.cwd()) {
  const git = (0, import_simple_git.simpleGit)(startDir);
  try {
    const root = await git.revparse(["--show-toplevel"]);
    return root.trim();
  } catch {
    throw new Error(`Not a git repository: ${startDir}`);
  }
}
async function getHeadCommitSha(repoRoot) {
  const git = (0, import_simple_git.simpleGit)(repoRoot);
  try {
    const sha = await git.revparse(["HEAD"]);
    return sha.trim();
  } catch {
    return "";
  }
}
async function getCurrentUser(repoRoot) {
  const git = (0, import_simple_git.simpleGit)(repoRoot);
  try {
    const name = await git.raw(["config", "user.name"]);
    return name.trim() || void 0;
  } catch {
    return void 0;
  }
}

// src/core/git/diff.ts
var import_simple_git2 = require("simple-git");
async function getChangedFiles(repoRoot, fromCommit, toCommit = "HEAD") {
  const git = (0, import_simple_git2.simpleGit)(repoRoot);
  try {
    let diff;
    if (fromCommit) {
      diff = await git.raw(["diff", "--name-only", fromCommit, toCommit]);
    } else {
      try {
        diff = await git.raw(["diff", "--name-only", "HEAD~1", "HEAD"]);
      } catch {
        diff = await git.raw(["diff-tree", "--no-commit-id", "-r", "--name-only", "HEAD"]);
      }
    }
    return diff.split("\n").map((f) => f.trim()).filter(Boolean);
  } catch {
    return [];
  }
}
async function getDiffString(repoRoot, range) {
  const git = (0, import_simple_git2.simpleGit)(repoRoot);
  try {
    return await git.raw(["diff", range]);
  } catch {
    return "";
  }
}

// src/core/git/hooks/installer.ts
var fs6 = __toESM(require("fs/promises"));
var path9 = __toESM(require("path"));
var import_simple_git3 = require("simple-git");
init_constants();
var HOOK_SCRIPT = `
# ${HOOK_SENTINEL}
if command -v git-why >/dev/null 2>&1; then
  git-why resolve --incremental --commit "$(git rev-parse HEAD)" || true
fi
`;
var HOOK_SCRIPT_CMD = `@echo off
rem ${HOOK_SENTINEL}
where git-why >nul 2>&1 && git-why resolve --incremental --commit %1 || exit 0
`;
async function getHooksDir(repoRoot) {
  const git = (0, import_simple_git3.simpleGit)(repoRoot);
  try {
    const hooksDir = await git.raw(["rev-parse", "--git-path", "hooks"]);
    return path9.resolve(repoRoot, hooksDir.trim());
  } catch {
    return path9.join(repoRoot, ".git", "hooks");
  }
}
async function installHook(repoRoot, hookMode = "post-commit") {
  const hooksDir = await getHooksDir(repoRoot);
  await fs6.mkdir(hooksDir, { recursive: true });
  const hookName = hookMode === "post-commit" ? POST_COMMIT_HOOK_NAME : PRE_COMMIT_HOOK_NAME;
  const hookPath = path9.join(hooksDir, hookName);
  let existingContent = "";
  try {
    existingContent = await fs6.readFile(hookPath, "utf8");
  } catch {
  }
  if (existingContent.includes(HOOK_SENTINEL)) {
    return;
  }
  if (existingContent) {
    await fs6.writeFile(hookPath, existingContent + "\n" + HOOK_SCRIPT.trim() + "\n", "utf8");
  } else {
    await fs6.writeFile(hookPath, `#!/usr/bin/env sh
${HOOK_SCRIPT.trim()}
`, "utf8");
  }
  try {
    await fs6.chmod(hookPath, 493);
  } catch {
  }
  if (process.platform === "win32") {
    const cmdPath = hookPath + ".cmd";
    await fs6.writeFile(cmdPath, HOOK_SCRIPT_CMD.trim() + "\r\n", "utf8");
  }
}
async function uninstallHook(repoRoot, hookMode = "post-commit") {
  const hooksDir = await getHooksDir(repoRoot);
  const hookName = hookMode === "post-commit" ? POST_COMMIT_HOOK_NAME : PRE_COMMIT_HOOK_NAME;
  const hookPath = path9.join(hooksDir, hookName);
  let content;
  try {
    content = await fs6.readFile(hookPath, "utf8");
  } catch {
    return;
  }
  if (!content.includes(HOOK_SENTINEL)) return;
  const lines = content.split("\n");
  const filteredLines = [];
  let inWhythoBlock = false;
  for (const line of lines) {
    if (line.includes(HOOK_SENTINEL)) {
      inWhythoBlock = true;
      continue;
    }
    if (inWhythoBlock && line.trim() === "") {
      inWhythoBlock = false;
      continue;
    }
    if (!inWhythoBlock) {
      filteredLines.push(line);
    }
  }
  const newContent = filteredLines.join("\n").trim();
  if (!newContent || newContent === "#!/usr/bin/env sh") {
    await fs6.unlink(hookPath).catch(() => void 0);
  } else {
    await fs6.writeFile(hookPath, newContent + "\n", "utf8");
  }
  try {
    await fs6.unlink(hookPath + ".cmd");
  } catch {
  }
}
async function isHookInstalled(repoRoot, hookMode = "post-commit") {
  const hooksDir = await getHooksDir(repoRoot);
  const hookName = hookMode === "post-commit" ? POST_COMMIT_HOOK_NAME : PRE_COMMIT_HOOK_NAME;
  const hookPath = path9.join(hooksDir, hookName);
  try {
    const content = await fs6.readFile(hookPath, "utf8");
    return content.includes(HOOK_SENTINEL);
  } catch {
    return false;
  }
}

// src/ai/providers/null.ts
init_constants();
var nullProvider = {
  name: "null",
  async generateAnnotation(request2) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const type = request2.type;
    const baseFrontmatter = {
      whytho: WHYTHO_VERSION,
      type,
      created: now,
      updated: now
    };
    return {
      frontmatter: baseFrontmatter,
      body: `<!-- Generated by null provider \u2014 replace with real annotations -->

## Purpose

[No AI provider configured.]
`
    };
  },
  async matchSemanticFingerprint(_request) {
    return { matchedIndex: null, confidence: 0 };
  }
};

// src/ai/prompts/annotate-block.ts
function buildBlockAnnotationPrompt(request2) {
  const { filePath, blockSource, parsedBlock, sessionContext } = request2.context;
  return `You are a technical documentation assistant. Generate a Whytho block annotation for the following code block.

File: ${filePath ?? "unknown"}
Block name: ${parsedBlock?.name ?? "unknown"}
Block kind: ${parsedBlock?.kind ?? "unknown"}
${sessionContext ? `
Session context:
${sessionContext}` : ""}

Code block:
\`\`\`
${blockSource ?? ""}
\`\`\`

Generate the annotation in three sections:

## Purpose
A clear 2-4 sentence description of what this block does and why it exists. Include its role within the containing file.

## Tradeoffs
List the key design decisions and their rationale. For each, describe what alternatives were considered and why the chosen approach was selected. If there are no significant tradeoffs, state "No significant tradeoffs identified."

## Uncertainty
List anything that might be wrong, incomplete, or worth revisiting. Format each as: **[topic]:** description. Confidence: [high/medium/low]. If nothing is uncertain, state "No significant uncertainties identified."

Also provide a semantic fingerprint: a 1-3 sentence natural language description of what this block does, suitable for identifying it even after heavy refactoring.

Format your response as:

SEMANTIC_FINGERPRINT: <1-3 sentences>

---

## Purpose

<content>

## Tradeoffs

<content>

## Uncertainty

<content>`;
}
function parseBlockAnnotationResponse(response) {
  const lines = response.split("\n");
  let semanticFingerprint = "";
  let bodyStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("SEMANTIC_FINGERPRINT:")) {
      semanticFingerprint = lines[i].replace("SEMANTIC_FINGERPRINT:", "").trim();
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "---") {
          bodyStart = j + 1;
          break;
        }
      }
      break;
    }
  }
  const body = lines.slice(bodyStart).join("\n").trim();
  return { semanticFingerprint, body };
}

// src/ai/prompts/annotate-file.ts
function buildFileAnnotationPrompt(request2) {
  const { filePath, sessionContext } = request2.context;
  return `You are a technical documentation assistant. Generate a Whytho file annotation.

File: ${filePath ?? "unknown"}
${sessionContext ? `
Session context:
${sessionContext}` : ""}

Generate the annotation body:

## Purpose
2-4 sentences describing why this file exists and its role within its folder. Include what business domain or technical concern it addresses.

## Session: [session-id]
**Why in scope:** Why this file was touched in the session.
**Changes:** Bullet list of what changed.

Respond with just the markdown body (no frontmatter).`;
}

// src/ai/prompts/annotate-folder.ts
function buildFolderAnnotationPrompt(request2) {
  const { filePath, sessionContext } = request2.context;
  return `You are a technical documentation assistant. Generate a Whytho folder annotation.

Folder: ${filePath ?? "unknown"}
${sessionContext ? `
Session context:
${sessionContext}` : ""}

Generate the annotation body with these sections:

## Purpose
2-4 sentences describing this folder's role in the codebase architecture.

## Structural Decisions
One subsection per significant structural decision made for this folder. For each, describe what was decided and why.

Respond with just the markdown body (no frontmatter).`;
}

// src/ai/prompts/annotate-session.ts
function buildSessionAnnotationPrompt(request2) {
  const { sessionContext, changedFiles, gitLog } = request2.context;
  return `You are a technical documentation assistant. Generate a Whytho session annotation body.

${sessionContext ? `Session context:
${sessionContext}
` : ""}
${changedFiles?.length ? `Changed files:
${changedFiles.join("\n")}
` : ""}
${gitLog ? `Git log:
${gitLog}
` : ""}

Generate the annotation body with these required sections:

## Objectives
A sequential list of objectives that emerged during this session. For each:
- State the objective clearly
- Note whether it was Completed, Partially Completed, or Deferred
- Brief explanation

## Decisions
For each significant decision made:
### [Decision title]
- **Origin:** [user/ai/collaborative]
- **Context:** What prompted this decision
- **Decision:** What was decided
- **Rationale:** Why
- **Alternatives considered:** What was rejected and why

## Uncertainty Log
Anything the AI flagged as potentially wrong, incomplete, or worth revisiting:
- **[Topic]:** Description. Confidence: [high/medium/low].

Respond with just the markdown body (no frontmatter).`;
}

// src/ai/prompts/semantic-match.ts
function buildSemanticMatchPrompt(request2) {
  const candidateList = request2.candidates.map((c, i) => {
    const b = c.block;
    return `[${i}] ${b.kind} "${b.name}" (${b.parentScope})
\`\`\`
${c.source.slice(0, 500)}
\`\`\``;
  }).join("\n\n");
  return `You are a code identity resolver. Given a semantic fingerprint description of a code block and a list of candidate blocks, determine which candidate best matches the fingerprint.

Semantic fingerprint:
"${request2.fingerprint}"

Candidates:
${candidateList}

Instructions:
- If one candidate clearly matches the fingerprint (same purpose, even if heavily rewritten), respond with: MATCH: <index> CONFIDENCE: <0.0-1.0>
- If no candidate matches (confidence < 0.7), respond with: NO_MATCH CONFIDENCE: <0.0-1.0>
- Confidence 1.0 = certain match, 0.7 = likely match, 0.5 = uncertain, below 0.7 = no match

Respond with exactly one line.`;
}
function parseSemanticMatchResponse(response) {
  const line = response.trim().split("\n")[0];
  const matchRe = /MATCH:\s*(\d+)\s+CONFIDENCE:\s*([\d.]+)/i;
  const noMatchRe = /NO_MATCH\s+CONFIDENCE:\s*([\d.]+)/i;
  const matchResult = line.match(matchRe);
  if (matchResult) {
    return {
      matchedIndex: parseInt(matchResult[1], 10),
      confidence: parseFloat(matchResult[2])
    };
  }
  const noMatchResult = line.match(noMatchRe);
  if (noMatchResult) {
    return { matchedIndex: null, confidence: parseFloat(noMatchResult[1]) };
  }
  return { matchedIndex: null, confidence: 0 };
}

// src/ai/providers/anthropic.ts
init_constants();
function createAnthropicProvider(options = {}) {
  const model = options.model ?? DEFAULT_AI_MODEL;
  let client = null;
  function getClient() {
    if (!client) {
      const { Anthropic } = require("@anthropic-ai/sdk");
      client = new Anthropic({ apiKey: options.apiKey });
    }
    return client;
  }
  async function callClaude(prompt) {
    const anthropic = getClient();
    const message = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }]
    });
    const block = message.content[0];
    if (block.type !== "text") return "";
    return block.text;
  }
  return {
    name: "anthropic",
    async generateAnnotation(request2) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      let body = "";
      const extraFrontmatter = {};
      switch (request2.type) {
        case "block": {
          const prompt = buildBlockAnnotationPrompt(request2);
          const response = await callClaude(prompt);
          const parsed = parseBlockAnnotationResponse(response);
          body = parsed.body;
          extraFrontmatter["_semantic_fingerprint"] = parsed.semanticFingerprint;
          break;
        }
        case "file": {
          const prompt = buildFileAnnotationPrompt(request2);
          body = await callClaude(prompt);
          break;
        }
        case "folder": {
          const prompt = buildFolderAnnotationPrompt(request2);
          body = await callClaude(prompt);
          break;
        }
        case "session": {
          const prompt = buildSessionAnnotationPrompt(request2);
          body = await callClaude(prompt);
          break;
        }
      }
      return {
        frontmatter: {
          whytho: WHYTHO_VERSION,
          type: request2.type,
          created: now,
          updated: now,
          ...extraFrontmatter
        },
        body
      };
    },
    async matchSemanticFingerprint(request2) {
      const prompt = buildSemanticMatchPrompt(request2);
      const response = await callClaude(prompt);
      return parseSemanticMatchResponse(response);
    }
  };
}

// src/ai/registry.ts
var registry = /* @__PURE__ */ new Map();
registry.set("null", nullProvider);
function registerProvider(provider) {
  registry.set(provider.name, provider);
}
function getProvider(name) {
  return registry.get(name);
}
function getDefaultProvider(config) {
  const name = config.aiProvider ?? "anthropic";
  if (name === "anthropic") {
    const apiKeyEnv = config.anthropic?.apiKeyEnv ?? "ANTHROPIC_API_KEY";
    const apiKey = process.env[apiKeyEnv];
    if (!apiKey) {
      console.warn(
        `[whytho] Warning: ${apiKeyEnv} not set. Using null AI provider. Set ${apiKeyEnv} to enable AI-powered annotations.`
      );
      return nullProvider;
    }
    return createAnthropicProvider({
      model: config.anthropic?.model,
      apiKey
    });
  }
  const provider = registry.get(name);
  if (!provider) {
    console.warn(`[whytho] Unknown AI provider: ${name}. Falling back to null provider.`);
    return nullProvider;
  }
  return provider;
}

// src/config/loader.ts
var fs7 = __toESM(require("fs/promises"));
var path10 = __toESM(require("path"));

// src/config/defaults.ts
init_constants();
var DEFAULT_CONFIG = {
  specVersion: "1.0",
  aiProvider: DEFAULT_AI_PROVIDER,
  anthropic: {
    model: DEFAULT_AI_MODEL,
    apiKeyEnv: "ANTHROPIC_API_KEY"
  },
  resolution: {
    confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
    supersededThreshold: DEFAULT_SUPERSEDED_THRESHOLD,
    runOnCommit: true,
    hookMode: "post-commit"
  },
  parser: {
    additionalPlugins: []
  },
  hooks: {},
  privacy: {
    omitUser: false
  }
};

// src/config/loader.ts
function mergeDeep(base, override) {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (overrideVal !== null && typeof overrideVal === "object" && !Array.isArray(overrideVal) && baseVal !== null && typeof baseVal === "object" && !Array.isArray(baseVal)) {
      result[key] = mergeDeep(
        baseVal,
        overrideVal
      );
    } else {
      result[key] = overrideVal;
    }
  }
  return result;
}
async function loadConfig(repoRoot) {
  const configFile = path10.join(repoRoot, "whytho.config.json");
  try {
    const raw = await fs7.readFile(configFile, "utf8");
    const parsed = JSON.parse(raw);
    return mergeDeep(
      DEFAULT_CONFIG,
      parsed
    );
  } catch {
  }
  const pkgFile = path10.join(repoRoot, "package.json");
  try {
    const raw = await fs7.readFile(pkgFile, "utf8");
    const pkg = JSON.parse(raw);
    if (pkg.whytho && typeof pkg.whytho === "object") {
      return mergeDeep(
        DEFAULT_CONFIG,
        pkg.whytho
      );
    }
  } catch {
  }
  return { ...DEFAULT_CONFIG };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BLOCK_KINDS,
  BlockFrontmatterSchema,
  BlockIdentitySchema,
  CANONICAL_METRICS,
  DEFAULT_CONFIG,
  FileFrontmatterSchema,
  FolderFrontmatterSchema,
  RELATIONSHIP_TYPES,
  RESOLUTION_OUTCOMES,
  RelationshipSchema,
  SessionFrontmatterSchema,
  ValidationError,
  WHYTHO_VERSION,
  archiveBlockAnnotation,
  archiveDir,
  archiveIndexPath,
  blockAnnotationPath,
  blocksDir,
  buildHookEvent,
  buildIndex,
  buildSymbolicRef,
  computeContentHash,
  createAnthropicProvider,
  detectLanguage,
  electCanonicalMetric,
  emitHookEvents,
  fileAnnotationPath,
  fileExists,
  filesDir,
  findArchivedBlocks,
  findRepoRoot,
  folderAnnotationPath,
  foldersDir,
  getAllRelated,
  getBlockHistory,
  getChangedFiles,
  getCurrentUser,
  getDefaultProvider,
  getDiffString,
  getHeadCommitSha,
  getPlugin,
  getProvider,
  getRelationshipsFrom,
  getRelationshipsTo,
  getWhyRoot,
  indexPath,
  initWhyDir,
  installHook,
  isHookInstalled,
  isTypeScriptOrJavaScript,
  isWhyDirInitialized,
  loadConfig,
  moveFile,
  nullProvider,
  parentFolder,
  parseAnnotation,
  parseFile,
  parseSymbolicRef,
  pathFromSlug,
  readAllArchivedBlocks,
  readAllBlocks,
  readAllFiles,
  readAllFolders,
  readAllSessions,
  readAnnotationFile,
  readIndex,
  rebuildArchiveIndex,
  registerPlugin,
  registerProvider,
  runResolutionPipeline,
  serializeAnnotation,
  sessionAnnotationPath,
  sessionsDir,
  slugFromBlockRef,
  slugFromPath,
  slugifyBlockName,
  uninstallHook,
  validateAnnotation,
  writeFile,
  writeJson
});
//# sourceMappingURL=index.js.map