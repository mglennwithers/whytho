import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot } from '../core/git/repo.js'
import {
  getWhyRoot,
  blockAnnotationPath,
  fileAnnotationPath,
  folderAnnotationPath,
  sessionAnnotationPath,
  sessionsDir,
} from '../core/fs/layout.js'
import {
  readAnnotationFile,
  readAllBlocks,
  readAllFiles,
  readAllFolders,
  readAllSessions,
  readIndex,
} from '../core/fs/reader.js'
import { fileExists } from '../core/fs/writer.js'
import { getAllRelated } from '../core/relationships/graph.js'
import { pushReasoning } from '../core/push/index.js'
import { WHYTHO_VERSION } from '../core/constants.js'
import { loadConfig } from '../config/loader.js'
import { getDefaultProvider } from '../ai/registry.js'
import { buildBlamePrompt, parseBlameResponse } from '../ai/prompts/blame.js'
import type { BlameEntry } from '../ai/prompts/blame.js'
import type { WhythoIndex, BlockFrontmatter, FileFrontmatter, FolderFrontmatter, SessionFrontmatter } from '../core/types.js'

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'get_block',
    description: 'Get the annotation for a specific code block (design rationale, tradeoffs, rejected alternatives). Use when you are about to read or modify a specific function and need its detailed "why".',
    inputSchema: {
      type: 'object',
      properties: {
        symbolic_ref: {
          type: 'string',
          description: 'Symbolic reference in the form "path/to/file.ts::blockName"',
        },
        include: {
          type: 'array',
          items: { type: 'string' },
          description: 'Sections to return: "frontmatter", "body", or a heading like "Purpose", "Tradeoffs", "Uncertainty". Omit for full content.',
        },
      },
      required: ['symbolic_ref'],
    },
  },
  {
    name: 'get_file',
    description: 'Get the raw annotation file for a source file (includes YAML frontmatter and full body). Prefer get_file_context for most agent use.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative file path, e.g. "src/auth/middleware.ts"' },
        include: {
          type: 'array',
          items: { type: 'string' },
          description: 'Sections to return: "frontmatter", "body", or a heading like "Purpose", "Tradeoffs", "Uncertainty". Omit for full content.',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'get_folder',
    description: 'Get the annotation for a folder by its path.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative folder path, e.g. "src/auth/" or "/" for root' },
        include: {
          type: 'array',
          items: { type: 'string' },
          description: 'Sections to return: "frontmatter", "body", or a heading like "Purpose", "Tradeoffs", "Uncertainty". Omit for full content.',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'get_session',
    description: 'Get a session annotation. Omit id to get the most recent session.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Session ID (e.g. "2026-03-20-session-abc123"). Omit for most recent.' },
        include: {
          type: 'array',
          items: { type: 'string' },
          description: 'Sections to return: "frontmatter", "body", or a heading like "Purpose", "Objectives", "Decisions", "Uncertainty Log". Omit for full content.',
        },
      },
    },
  },
  {
    name: 'get_annotations',
    description: [
      'Retrieve multiple annotations in a single call. Each item specifies a type and ref.',
      'Supports section filtering via include — same values as the single-get tools.',
      'Use this instead of multiple get_block/get_file calls when you need several annotations at once.',
    ].join('\n'),
    inputSchema: {
      type: 'object',
      properties: {
        refs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['block', 'file', 'folder', 'session'],
                description: 'Annotation type',
              },
              ref: {
                type: 'string',
                description: 'Identifier: symbolic ref for block, path for file/folder, session ID or "latest" for session',
              },
              include: {
                type: 'array',
                items: { type: 'string' },
                description: 'Sections to return: "frontmatter", "body", or a heading name. Omit for full content.',
              },
            },
            required: ['type', 'ref'],
          },
          description: 'Array of annotation references to retrieve',
        },
      },
      required: ['refs'],
    },
  },
  {
    name: 'get_file_context',
    description: [
      'Get annotation context for a source file.',
      '',
      'Choose the right mode for your task:',
      '- purpose_only: true — "What does this file do?" One-paragraph summary, no blocks. Use when scanning multiple files to find the right one.',
      '- max_blocks: 0 — File-level annotation only (purpose + design notes). Use when you need full file context but not block detail.',
      '- default (max_blocks: 10) — File annotation + top 10 block annotations. Use before modifying a file to get full reasoning.',
      '- max_blocks: N — Increase if you need more blocks; remaining blocks are listed by ref for get_block.',
    ].join('\n'),
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative file path, e.g. "src/auth/middleware.ts"' },
        max_blocks: { type: 'number', description: 'Max number of full block annotations to include (default: 10). Set to 0 for file annotation only.' },
        purpose_only: { type: 'boolean', description: 'Return only the Purpose section of the file annotation — no blocks, no design notes. Fast scan for "what does this file do?"' },
      },
      required: ['path'],
    },
  },
  {
    name: 'get_related',
    description: 'Get all blocks related to a given block via the relationship graph (extends, depends_on, implements, etc.). Use before modifying a block to understand what depends on it.',
    inputSchema: {
      type: 'object',
      properties: {
        symbolic_ref: {
          type: 'string',
          description: 'Symbolic reference of the block to look up relationships for',
        },
      },
      required: ['symbolic_ref'],
    },
  },
  {
    name: 'list_sessions',
    description: 'List recent annotation sessions, most recent first.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max sessions to return (default: 10)' },
      },
    },
  },
  {
    name: 'search',
    description: 'Search annotation bodies and metadata for a query string. Use when you know the topic or concept but not which file or block it lives in.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Text to search for (case-insensitive)' },
        type: {
          type: 'string',
          enum: ['block', 'file', 'folder', 'session'],
          description: 'Annotation type to search. Omit to search all.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'push_note',
    description: 'Push a reasoning note directly to a block, file, or session annotation without AI inference. Use this to record your own reasoning.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['block', 'file', 'session'],
          description: 'Annotation type to push to',
        },
        ref: {
          type: 'string',
          description: 'Target ref: symbolic ref for block (file::name), file path for file, session ID or "latest" for session',
        },
        body: { type: 'string', description: 'Reasoning text to add' },
      },
      required: ['type', 'ref', 'body'],
    },
  },
  {
    name: 'get_summary',
    description: 'Get a high-level summary of annotation coverage: block/file/session counts and recent sessions. Use this as your first call when starting a new task to understand what reasoning is captured.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'blame',
    description: [
      'Given a natural-language description of a bug or behavior, find annotations whose design reasoning causally explains why that behavior exists.',
      'Returns matching annotations ranked by causal strength, or a summary explaining why no annotations match.',
      'Use this when debugging unexpected behavior to check if prior design decisions explain it.',
    ].join('\n'),
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Description of the bug, behavior, or observable outcome to investigate',
        },
        type: {
          type: 'string',
          enum: ['block', 'file', 'folder', 'session'],
          description: 'Filter by annotation type. Omit to search all.',
        },
      },
      required: ['query'],
    },
  },
]

// ─── Resource Templates ────────────────────────────────────────────────────────

const RESOURCE_TEMPLATES = [
  {
    uriTemplate: 'whytho://blocks/{symbolic_ref}',
    name: 'Block annotation',
    description: 'Annotation for a specific code block. Use symbolic_ref in the form "path/to/file.ts::blockName" (URL-encode :: as %3A%3A or use -- as separator).',
    mimeType: 'text/markdown',
  },
  {
    uriTemplate: 'whytho://files/{path}',
    name: 'File annotation',
    description: 'Annotation for a source file.',
    mimeType: 'text/markdown',
  },
  {
    uriTemplate: 'whytho://folders/{path}',
    name: 'Folder annotation',
    description: 'Annotation for a folder.',
    mimeType: 'text/markdown',
  },
  {
    uriTemplate: 'whytho://sessions/{id}',
    name: 'Session annotation',
    description: 'Annotation for a coding session.',
    mimeType: 'text/markdown',
  },
]

// ─── Helper: safe raw file read ───────────────────────────────────────────────

async function readRaw(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }
}

// ─── Helper: strip YAML frontmatter, return body only ─────────────────────────

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)
  return match ? match[1].trim() : content
}

// ─── Helper: extract only the ## Purpose section from an annotation body ──────

function extractPurpose(body: string): string {
  const match = body.match(/##\s+Purpose\n+([\s\S]*?)(?=\n##\s|\n---\s*\n|$)/)
  return match ? match[1].trim() : body.trim()
}

// ─── Helper: extract a named ## section from a markdown body ──────────────────

function extractSection(body: string, heading: string): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(##\\s+${escaped})\\n+([\\s\\S]*?)(?=\\n##\\s|\\n---\\s*\\n|$)`, 'i')
  const match = body.match(re)
  return match ? `${match[1]}\n\n${match[2].trim()}` : null
}

// ─── Helper: apply include filter to raw annotation content ───────────────────

function applyIncludeFilter(raw: string, include?: string[]): string {
  if (!include || include.length === 0) return raw

  const body = stripFrontmatter(raw)
  const parts: string[] = []

  for (const section of include) {
    if (section === 'frontmatter') {
      const match = raw.match(/^---\n([\s\S]*?)\n---/)
      if (match) parts.push(`---\n${match[1]}\n---`)
    } else if (section === 'body') {
      parts.push(body)
    } else {
      const extracted = extractSection(body, section)
      if (extracted) parts.push(extracted)
    }
  }

  return parts.join('\n\n')
}

// ─── Helper: resolve annotation path from type + ref ──────────────────────────

function resolveAnnotationPath(whyRoot: string, type: string, ref: string): string {
  switch (type) {
    case 'block': return blockAnnotationPath(whyRoot, ref)
    case 'file': return fileAnnotationPath(whyRoot, ref)
    case 'folder': return folderAnnotationPath(whyRoot, ref)
    case 'session': return sessionAnnotationPath(whyRoot, ref)
    default: throw new Error(`Unknown annotation type: ${type}`)
  }
}

// ─── Helper: find latest session ──────────────────────────────────────────────

async function findLatestSessionId(whyRoot: string): Promise<string | undefined> {
  const dir = sessionsDir(whyRoot)
  try {
    const files = await fs.readdir(dir)
    const mdFiles = files.filter((f) => f.endsWith('.md')).sort().reverse()
    return mdFiles.length > 0 ? mdFiles[0].replace(/\.md$/, '') : undefined
  } catch {
    return undefined
  }
}

// ─── Server Factory ───────────────────────────────────────────────────────────

export async function createWhythoServer(): Promise<Server> {
  const repoRoot = await findRepoRoot()
  const whyRoot = getWhyRoot(repoRoot)

  const server = new Server(
    { name: 'whytho', version: WHYTHO_VERSION },
    { capabilities: { resources: {}, tools: {} } },
  )

  // ── List Tools ────────────────────────────────────────────────────────────

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }))

  // ── Call Tool ─────────────────────────────────────────────────────────────

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    const a = (args ?? {}) as Record<string, unknown>

    try {
      switch (name) {
        case 'get_block': {
          const ref = a.symbolic_ref as string
          const include = a.include as string[] | undefined
          const annPath = blockAnnotationPath(whyRoot, ref)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for block: ${ref}`)
          return text(applyIncludeFilter(content, include))
        }

        case 'get_file': {
          const filePath = a.path as string
          const include = a.include as string[] | undefined
          const annPath = fileAnnotationPath(whyRoot, filePath)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for file: ${filePath}`)
          return text(applyIncludeFilter(content, include))
        }

        case 'get_folder': {
          const folderPath = a.path as string
          const include = a.include as string[] | undefined
          const annPath = folderAnnotationPath(whyRoot, folderPath)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for folder: ${folderPath}`)
          return text(applyIncludeFilter(content, include))
        }

        case 'get_session': {
          const id = (a.id as string | undefined) ?? await findLatestSessionId(whyRoot)
          if (!id) return text('No sessions found. Run: git why annotate')
          const include = a.include as string[] | undefined
          const annPath = sessionAnnotationPath(whyRoot, id)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for session: ${id}`)
          return text(applyIncludeFilter(content, include))
        }

        case 'get_annotations': {
          const refs = a.refs as Array<{ type: string; ref: string; include?: string[] }>
          if (!refs?.length) return text('No refs provided.')

          const parts: string[] = []
          for (const item of refs) {
            let ref = item.ref
            if (item.type === 'session' && ref === 'latest') {
              ref = await findLatestSessionId(whyRoot) ?? ''
              if (!ref) { parts.push(`# [session] latest\n\n_No sessions found._`); continue }
            }
            const annPath = resolveAnnotationPath(whyRoot, item.type, ref)
            const content = await readRaw(annPath)
            if (!content) {
              parts.push(`# [${item.type}] ${ref}\n\n_No annotation found._`)
            } else {
              const filtered = applyIncludeFilter(content, item.include)
              parts.push(`# [${item.type}] ${ref}\n\n${filtered}`)
            }
          }
          return text(parts.join('\n\n---\n\n'))
        }

        case 'get_file_context': {
          const filePath = a.path as string
          const maxBlocks = typeof a.max_blocks === 'number' ? a.max_blocks : 10
          const purposeOnly = Boolean(a.purpose_only)
          const parts: string[] = []

          // File annotation
          const fileAnnPath = fileAnnotationPath(whyRoot, filePath)
          const fileContent = await readRaw(fileAnnPath)

          if (purposeOnly) {
            if (!fileContent) return text(`No annotation found for file: ${filePath}`)
            const purpose = extractPurpose(stripFrontmatter(fileContent))
            return text(`# ${filePath}\n\n${purpose}`)
          }

          if (fileContent) {
            parts.push(`# File: ${filePath}\n`)
            parts.push(fileContent)
          } else {
            parts.push(`# File: ${filePath}\n\n_No file annotation found._`)
          }

          // Block annotations — get list from file frontmatter or index
          let blockRefs: string[] = []
          if (fileContent) {
            try {
              const parsed = await readAnnotationFile<FileFrontmatter>(fileAnnPath)
              blockRefs = parsed.frontmatter.blocks ?? []
            } catch { /* ignore */ }
          }

          if (blockRefs.length === 0) {
            // Fall back to index
            const index = await readIndex(whyRoot) as unknown as WhythoIndex
            const fileEntry = index.files?.[filePath]
            blockRefs = fileEntry?.blocks ?? []
          }

          const included = blockRefs.slice(0, maxBlocks)
          const overflow = blockRefs.slice(maxBlocks)

          for (const ref of included) {
            const blockPath = blockAnnotationPath(whyRoot, ref)
            const blockContent = await readRaw(blockPath)
            if (blockContent) {
              const blockName = ref.split('::')[1] ?? ref
              parts.push(`\n---\n\n## Block: ${blockName}\n`)
              parts.push(stripFrontmatter(blockContent))
            }
          }

          if (overflow.length > 0) {
            parts.push(`\n---\n\n## ${overflow.length} more block(s) not shown (max_blocks: ${maxBlocks})\n`)
            parts.push('Use `get_block` to fetch any of these individually:\n')
            for (const ref of overflow) {
              parts.push(`- \`${ref}\``)
            }
            parts.push('\nOr call `get_file_context` with a higher `max_blocks` value.')
          }

          if (parts.length === 0) return text(`No annotations found for file: ${filePath}`)
          return text(parts.join('\n'))
        }

        case 'get_related': {
          const ref = a.symbolic_ref as string
          const index = await readIndex(whyRoot) as unknown as WhythoIndex
          if (!index.relationships) return text(`No relationship data in index. Run: git why resolve`)

          const related = getAllRelated(index, ref)
          if (related.length === 0) return text(`No relationships found for: ${ref}`)

          const parts = [`# Relationships for: ${ref}\n`]
          for (const { direction, edge } of related) {
            const other = direction === 'out' ? edge.target : edge.source
            const arrow = direction === 'out' ? '→' : '←'
            parts.push(`\n## ${arrow} ${edge.type}: ${other}\n`)

            const blockPath = blockAnnotationPath(whyRoot, other)
            const content = await readRaw(blockPath)
            if (content) parts.push(content)
            else parts.push('_No annotation found_')
          }
          return text(parts.join('\n'))
        }

        case 'list_sessions': {
          const limit = (a.limit as number | undefined) ?? 10
          const sessions = await readAllSessions(whyRoot)
          const sorted = sessions
            .sort((a, b) => (b.frontmatter.created ?? '').localeCompare(a.frontmatter.created ?? ''))
            .slice(0, limit)

          if (sorted.length === 0) return text('No sessions found. Run: git why annotate')

          const lines = ['# Sessions\n']
          for (const s of sorted) {
            const fm = s.frontmatter
            lines.push(`## ${fm.id}`)
            lines.push(`- **Created:** ${fm.created}`)
            lines.push(`- **Model:** ${fm.model ?? 'unknown'}`)
            if (fm.files_touched?.length) lines.push(`- **Files:** ${fm.files_touched.length}`)
            if (fm.blocks_touched?.length) lines.push(`- **Blocks:** ${fm.blocks_touched.length}`)
            if (fm.commits?.length) {
              const sha = typeof fm.commits[0] === 'string'
                ? fm.commits[0]
                : (fm.commits[0] as { sha: string }).sha
              lines.push(`- **Commit:** ${String(sha).slice(0, 8)}`)
            }
            lines.push('')
          }
          return text(lines.join('\n'))
        }

        case 'search': {
          const query = (a.query as string).toLowerCase()
          const typeFilter = a.type as string | undefined
          const results: string[] = []

          async function searchAnnotations<T>(
            reader: () => Promise<Array<{ frontmatter: T; body: string; filePath: string }>>,
            kind: string,
            getRef: (fm: T) => string,
          ): Promise<void> {
            const anns = await reader()
            for (const ann of anns) {
              const bodyLower = ann.body.toLowerCase()
              const refLower = getRef(ann.frontmatter).toLowerCase()
              if (bodyLower.includes(query) || refLower.includes(query)) {
                const ref = getRef(ann.frontmatter)
                const preview = ann.body.slice(0, 200).replace(/\n+/g, ' ').trim()
                results.push(`**[${kind}]** ${ref}\n> ${preview}\n`)
              }
            }
          }

          if (!typeFilter || typeFilter === 'block') {
            await searchAnnotations<BlockFrontmatter>(
              () => readAllBlocks(whyRoot),
              'block',
              (fm) => fm.symbolic_ref,
            )
          }
          if (!typeFilter || typeFilter === 'file') {
            await searchAnnotations<FileFrontmatter>(
              () => readAllFiles(whyRoot),
              'file',
              (fm) => fm.path,
            )
          }
          if (!typeFilter || typeFilter === 'folder') {
            await searchAnnotations<FolderFrontmatter>(
              () => readAllFolders(whyRoot),
              'folder',
              (fm) => fm.path,
            )
          }
          if (!typeFilter || typeFilter === 'session') {
            await searchAnnotations<SessionFrontmatter>(
              () => readAllSessions(whyRoot),
              'session',
              (fm) => fm.id,
            )
          }

          if (results.length === 0) return text(`No annotations matching: "${a.query}"`)
          return text(`# Search results for "${a.query}"\n\n${results.join('\n---\n\n')}`)
        }

        case 'push_note': {
          const result = await pushReasoning({
            repoRoot,
            type: a.type as 'block' | 'file' | 'session',
            ref: a.ref as string,
            body: a.body as string,
          })
          return text(`Note ${result.action} at: ${path.relative(repoRoot, result.path)}`)
        }

        case 'get_summary': {
          const index = await readIndex(whyRoot) as unknown as WhythoIndex
          if (!index.whytho_version) return text('No index found. Run: git why init && git why infer')

          const blockCount = Object.keys(index.blocks ?? {}).length
          const fileCount = Object.keys(index.files ?? {}).length
          const folderCount = Object.keys(index.folders ?? {}).length
          const sessionCount = Object.keys(index.sessions ?? {}).length
          const unresolved = index.unresolved?.length ?? 0
          const relationships = index.relationships?.length ?? 0

          // Count inferred blocks
          const allBlocks = await readAllBlocks(whyRoot)
          const inferredCount = allBlocks.filter((b) => b.frontmatter.inferred).length

          const lines = [
            `# Whytho Repository Summary`,
            ``,
            `**Index generated:** ${index.generated_at ?? 'unknown'}`,
            `**Commit:** ${String(index.generated_at_commit ?? 'unknown').slice(0, 8)}`,
            ``,
            `## Coverage`,
            `- **Sessions:** ${sessionCount}`,
            `- **Folders:** ${folderCount}`,
            `- **Files:** ${fileCount}`,
            `- **Blocks:** ${blockCount} (${inferredCount} inferred, ${blockCount - inferredCount} from sessions)`,
            `- **Relationships:** ${relationships}`,
            `- **Unresolved:** ${unresolved}`,
            ``,
            `## Recent Sessions`,
          ]

          const sessions = Object.values(index.sessions ?? {})
            .sort((a, b) => (b as {created: string}).created.localeCompare((a as {created: string}).created))
            .slice(0, 5)

          for (const s of sessions) {
            const sess = s as { id: string; created: string; files_touched: string[] }
            lines.push(`- **${sess.id}** (${sess.created?.slice(0, 10) ?? '?'}) — ${sess.files_touched?.length ?? 0} files`)
          }

          return text(lines.join('\n'))
        }

        case 'blame': {
          const query = a.query as string
          const typeFilter = a.type as string | undefined
          const BODY_LENGTH = 500

          const blocks = (!typeFilter || typeFilter === 'block') ? await readAllBlocks(whyRoot) : []
          const files = (!typeFilter || typeFilter === 'file') ? await readAllFiles(whyRoot) : []
          const folders = (!typeFilter || typeFilter === 'folder') ? await readAllFolders(whyRoot) : []
          const sessions = (!typeFilter || typeFilter === 'session') ? await readAllSessions(whyRoot) : []

          const entries: BlameEntry[] = []
          for (const ann of blocks) {
            if (ann.body.trim().length > 0) {
              entries.push({ type: 'block', ref: (ann.frontmatter as BlockFrontmatter).symbolic_ref, body: ann.body.slice(0, BODY_LENGTH).trim() })
            }
          }
          for (const ann of files) {
            if (ann.body.trim().length > 0) {
              entries.push({ type: 'file', ref: (ann.frontmatter as FileFrontmatter).path, body: ann.body.slice(0, BODY_LENGTH).trim() })
            }
          }
          for (const ann of folders) {
            if (ann.body.trim().length > 0) {
              entries.push({ type: 'folder', ref: (ann.frontmatter as FolderFrontmatter).path, body: ann.body.slice(0, BODY_LENGTH).trim() })
            }
          }
          for (const ann of sessions) {
            if (ann.body.trim().length > 0) {
              entries.push({ type: 'session', ref: (ann.frontmatter as SessionFrontmatter).id, body: ann.body.slice(0, BODY_LENGTH).trim() })
            }
          }

          if (entries.length === 0) return text('No annotations found to search.')

          const config = await loadConfig(repoRoot)
          const provider = getDefaultProvider(config)
          const prompt = buildBlamePrompt(query, entries)
          const result = await provider.generateAnnotation({
            type: 'block',
            context: { customPrompt: prompt },
          })

          const blameResult = parseBlameResponse(result.body)
          const hits = blameResult.matches
            .filter((m) => m.index >= 0 && m.index < entries.length)
            .map((m) => ({
              type: entries[m.index].type,
              ref: entries[m.index].ref,
              explanation: m.explanation,
              body: entries[m.index].body,
            }))

          if (hits.length === 0) {
            const summary = blameResult.noMatchSummary ?? 'No annotations causally explain the described behavior.'
            return text(`# No matches for: "${query}"\n\n${summary}`)
          }

          const parts = [`# ${hits.length} annotation(s) may explain: "${query}"\n`]
          for (const hit of hits) {
            parts.push(`## [${hit.type}] ${hit.ref}`)
            parts.push(`**Why this matches:** ${hit.explanation}\n`)
            parts.push(hit.body)
            parts.push('')
          }
          return text(parts.join('\n'))
        }

        default:
          return text(`Unknown tool: ${name}`)
      }
    } catch (err) {
      return text(`Error: ${String(err)}`)
    }
  })

  // ── List Resources ────────────────────────────────────────────────────────

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: 'whytho://index',
        name: 'Whytho index',
        description: 'The full annotation index (index.json) — a denormalized view of all sessions, files, blocks, and relationships.',
        mimeType: 'application/json',
      },
    ],
  }))

  // ── List Resource Templates ────────────────────────────────────────────────

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: RESOURCE_TEMPLATES,
  }))

  // ── Read Resource ─────────────────────────────────────────────────────────

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri

    if (uri === 'whytho://index') {
      const index = await readIndex(whyRoot)
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(index, null, 2),
        }],
      }
    }

    // Parse URI — strip scheme and split on first /
    const withoutScheme = uri.replace(/^whytho:\/\//, '')
    const slashIdx = withoutScheme.indexOf('/')
    if (slashIdx === -1) throw new Error(`Invalid whytho URI: ${uri}`)

    const resourceType = withoutScheme.slice(0, slashIdx)
    const resourceId = decodeURIComponent(withoutScheme.slice(slashIdx + 1))

    let annPath: string
    switch (resourceType) {
      case 'blocks':
        annPath = blockAnnotationPath(whyRoot, resourceId)
        break
      case 'files':
        annPath = fileAnnotationPath(whyRoot, resourceId)
        break
      case 'folders':
        annPath = folderAnnotationPath(whyRoot, resourceId)
        break
      case 'sessions':
        annPath = sessionAnnotationPath(whyRoot, resourceId)
        break
      default:
        throw new Error(`Unknown whytho resource type: ${resourceType}`)
    }

    const content = await readRaw(annPath)
    if (!content) throw new Error(`Annotation not found: ${uri}`)

    return {
      contents: [{
        uri,
        mimeType: 'text/markdown',
        text: content,
      }],
    }
  })

  return server
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

export async function startMcpServer(): Promise<void> {
  const server = await createWhythoServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function text(content: string): { content: Array<{ type: 'text'; text: string }> } {
  return { content: [{ type: 'text', text: content }] }
}
