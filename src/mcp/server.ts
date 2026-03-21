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
import type { WhythoIndex, BlockFrontmatter, FileFrontmatter, FolderFrontmatter, SessionFrontmatter } from '../core/types.js'

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'get_block',
    description: 'Get the annotation (reasoning and context) for a specific code block by its symbolic reference (file::blockName).',
    inputSchema: {
      type: 'object',
      properties: {
        symbolic_ref: {
          type: 'string',
          description: 'Symbolic reference in the form "path/to/file.ts::blockName"',
        },
      },
      required: ['symbolic_ref'],
    },
  },
  {
    name: 'get_file',
    description: 'Get the annotation for a source file by its path.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative file path, e.g. "src/auth/middleware.ts"' },
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
      },
    },
  },
  {
    name: 'get_file_context',
    description: 'Get the full annotation context for a file: its file-level annotation plus all block annotations within it. Most useful for code review.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative file path, e.g. "src/auth/middleware.ts"' },
      },
      required: ['path'],
    },
  },
  {
    name: 'get_related',
    description: 'Get all blocks related to a given block via the relationship graph (extends, depends_on, implements, etc.).',
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
    description: 'Search annotation bodies and metadata for a query string.',
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
    description: 'Get a high-level summary of what whytho knows about this repository.',
    inputSchema: {
      type: 'object',
      properties: {},
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
          const annPath = blockAnnotationPath(whyRoot, ref)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for block: ${ref}`)
          return text(content)
        }

        case 'get_file': {
          const filePath = a.path as string
          const annPath = fileAnnotationPath(whyRoot, filePath)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for file: ${filePath}`)
          return text(content)
        }

        case 'get_folder': {
          const folderPath = a.path as string
          const annPath = folderAnnotationPath(whyRoot, folderPath)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for folder: ${folderPath}`)
          return text(content)
        }

        case 'get_session': {
          const id = (a.id as string | undefined) ?? await findLatestSessionId(whyRoot)
          if (!id) return text('No sessions found. Run: git why annotate')
          const annPath = sessionAnnotationPath(whyRoot, id)
          const content = await readRaw(annPath)
          if (!content) return text(`No annotation found for session: ${id}`)
          return text(content)
        }

        case 'get_file_context': {
          const filePath = a.path as string
          const parts: string[] = []

          // File annotation
          const fileAnnPath = fileAnnotationPath(whyRoot, filePath)
          const fileContent = await readRaw(fileAnnPath)
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

          for (const ref of blockRefs) {
            const blockPath = blockAnnotationPath(whyRoot, ref)
            const blockContent = await readRaw(blockPath)
            if (blockContent) {
              const blockName = ref.split('::')[1] ?? ref
              parts.push(`\n---\n\n## Block: ${blockName}\n`)
              parts.push(blockContent)
            }
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
