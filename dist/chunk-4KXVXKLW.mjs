var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/core/fs/reader.ts
import * as fs from "fs/promises";
import * as path2 from "path";

// src/core/frontmatter/parse.ts
import matter from "gray-matter";
function parseAnnotation(raw) {
  const { data, content } = matter(raw);
  return {
    frontmatter: data,
    body: content.trim()
  };
}

// src/core/fs/layout.ts
import * as path from "path";

// src/core/constants.ts
var WHYTHO_VERSION = "1.0";
var WHY_DIR = ".why";
var SESSIONS_DIR = "sessions";
var FOLDERS_DIR = "folders";
var FILES_DIR = "files";
var BLOCKS_DIR = "blocks";
var ARCHIVE_DIR = "archive";
var INDEX_FILE = "index.json";
var ARCHIVE_INDEX_FILE = "archive-index.json";
var ROOT_FOLDER_ANNOTATION = "root.md";
var PATH_SEPARATOR = "--";
var DEFAULT_CONFIDENCE_THRESHOLD = 0.3;
var DEFAULT_SUPERSEDED_THRESHOLD = 0.3;
var SEMANTIC_MATCH_MIN_CONFIDENCE = 0.7;
var DEFAULT_SEMANTIC_TIMEOUT_MS = 1e4;
var DEFAULT_AI_MODEL = "claude-opus-4-6";
var DEFAULT_AI_PROVIDER = "anthropic";
var HOOK_SENTINEL = "# whytho-hook-v1";
var POST_COMMIT_HOOK_NAME = "post-commit";
var PRE_COMMIT_HOOK_NAME = "pre-commit";
var CANONICAL_METRICS = [
  "symbolic",
  "line_range",
  "content_hash",
  "structural",
  "semantic_fingerprint",
  "none"
];
var RESOLUTION_OUTCOMES = [
  "RESOLVED",
  "RELOCATED",
  "RENAMED",
  "SPLIT",
  "MERGED",
  "DELETED",
  "SUPERSEDED",
  "UNRESOLVABLE"
];
var RELATIONSHIP_TYPES = [
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
var BLOCK_KINDS = [
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
var ANNOTATION_TYPES = ["session", "folder", "file", "block"];
var ARCHIVE_REASONS = ["deleted", "superseded", "split", "merged"];

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

// src/core/fs/reader.ts
async function readAnnotationFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = parseAnnotation(raw);
  return { ...parsed, filePath };
}
async function readAllAnnotations(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const results = [];
  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    const filePath = path2.join(dir, entry);
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
  const idxPath = path2.join(whyRoot, "index.json");
  try {
    const raw = await fs.readFile(idxPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function readArchiveIndex(whyRoot) {
  const idxPath = path2.join(whyRoot, "archive-index.json");
  try {
    const raw = await fs.readFile(idxPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export {
  __require,
  WHYTHO_VERSION,
  DEFAULT_CONFIDENCE_THRESHOLD,
  DEFAULT_SUPERSEDED_THRESHOLD,
  SEMANTIC_MATCH_MIN_CONFIDENCE,
  DEFAULT_SEMANTIC_TIMEOUT_MS,
  DEFAULT_AI_MODEL,
  DEFAULT_AI_PROVIDER,
  HOOK_SENTINEL,
  POST_COMMIT_HOOK_NAME,
  PRE_COMMIT_HOOK_NAME,
  CANONICAL_METRICS,
  RESOLUTION_OUTCOMES,
  RELATIONSHIP_TYPES,
  BLOCK_KINDS,
  ANNOTATION_TYPES,
  ARCHIVE_REASONS,
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
  safeArchivePath,
  parseSymbolicRef,
  buildSymbolicRef,
  parentFolder,
  parseAnnotation,
  readAnnotationFile,
  readAllAnnotations,
  readAllBlocks,
  readAllFiles,
  readAllFolders,
  readAllSessions,
  readAllArchivedBlocks,
  readIndex,
  readArchiveIndex
};
//# sourceMappingURL=chunk-4KXVXKLW.mjs.map