import type { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, indexPath } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { readAllBlocks, readAllFiles, readAllFolders, readAllSessions } from '../../core/fs/reader.js'
import { writeFile } from '../../core/fs/writer.js'
import type { WhythoIndex } from '../../core/types.js'

interface ExportOpts {
  format?: 'json' | 'markdown'
  out?: string
  include?: string[]
}

export function registerExport(program: Command): void {
  program
    .command('export')
    .description('Export all annotations as a single JSON or Markdown file for use in RAG pipelines, docs, or sharing')
    .option('--format <fmt>', 'Output format: json (default) or markdown', 'json')
    .option('--out <file>', 'Write output to a file instead of stdout')
    .option(
      '--include <types>',
      'Comma-separated annotation types to include: blocks,files,folders,sessions (default: all)',
      (v: string) => v.split(',').map((s) => s.trim()),
      ['blocks', 'files', 'folders', 'sessions'],
    )
    .action(async (options: ExportOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const include = new Set(options.include ?? ['blocks', 'files', 'folders', 'sessions'])

        const [blocks, files, folders, sessions, index] = await Promise.all([
          include.has('blocks') ? readAllBlocks(whyRoot) : Promise.resolve([]),
          include.has('files') ? readAllFiles(whyRoot) : Promise.resolve([]),
          include.has('folders') ? readAllFolders(whyRoot) : Promise.resolve([]),
          include.has('sessions') ? readAllSessions(whyRoot) : Promise.resolve([]),
          fs.readFile(indexPath(whyRoot), 'utf8').then((r) => JSON.parse(r) as WhythoIndex).catch(() => null),
        ])

        let output: string

        if (options.format === 'markdown') {
          const sections: string[] = []
          sections.push('# Whytho Annotation Export')
          sections.push('')
          sections.push(`**Generated:** ${new Date().toISOString()}`)
          if (index) {
            sections.push(`**Commit:** ${index.generated_at_commit ?? 'unknown'}`)
          }
          sections.push('')
          sections.push('---')
          sections.push('')

          if (sessions.length > 0) {
            sections.push('## Sessions')
            sections.push('')
            for (const ann of sessions) {
              sections.push(`### Session: ${ann.frontmatter.id}`)
              sections.push('')
              sections.push(ann.body.trim())
              sections.push('')
              sections.push('---')
              sections.push('')
            }
          }

          if (folders.length > 0) {
            sections.push('## Folders')
            sections.push('')
            for (const ann of folders) {
              sections.push(`### ${ann.frontmatter.path}`)
              sections.push('')
              sections.push(ann.body.trim())
              sections.push('')
            }
            sections.push('---')
            sections.push('')
          }

          if (files.length > 0) {
            sections.push('## Files')
            sections.push('')
            for (const ann of [...files].sort((a, b) => a.frontmatter.path.localeCompare(b.frontmatter.path))) {
              sections.push(`### \`${ann.frontmatter.path}\``)
              sections.push('')
              sections.push(ann.body.trim())
              sections.push('')
            }
            sections.push('---')
            sections.push('')
          }

          if (blocks.length > 0) {
            sections.push('## Blocks')
            sections.push('')
            for (const ann of [...blocks].sort((a, b) => a.frontmatter.symbolic_ref.localeCompare(b.frontmatter.symbolic_ref))) {
              sections.push(`### \`${ann.frontmatter.symbolic_ref}\``)
              sections.push('')
              sections.push(ann.body.trim())
              sections.push('')
            }
          }

          output = sections.join('\n')
        } else {
          // JSON format
          output = JSON.stringify({
            whytho_version: index?.whytho_version ?? '1.0',
            exported_at: new Date().toISOString(),
            generated_at_commit: index?.generated_at_commit,
            sessions: sessions.map((a) => ({ frontmatter: a.frontmatter, body: a.body })),
            folders: folders.map((a) => ({ frontmatter: a.frontmatter, body: a.body })),
            files: files.map((a) => ({ frontmatter: a.frontmatter, body: a.body })),
            blocks: blocks.map((a) => ({ frontmatter: a.frontmatter, body: a.body })),
            relationships: index?.relationships ?? [],
          }, null, 2)
        }

        if (options.out) {
          await writeFile(options.out, output)
          const counts = [
            sessions.length > 0 && `${sessions.length} sessions`,
            folders.length > 0 && `${folders.length} folders`,
            files.length > 0 && `${files.length} files`,
            blocks.length > 0 && `${blocks.length} blocks`,
          ].filter(Boolean).join(', ')
          console.log(chalk.green(`✓ Exported ${counts} to ${options.out}`))
        } else {
          process.stdout.write(`${output}\n`)
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
