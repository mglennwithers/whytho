import type { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, blocksDir, filesDir, foldersDir } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { parseAnnotation } from '../../core/frontmatter/parse.js'
import {
  BlockFrontmatterSchema,
  FileFrontmatterSchema,
  FolderFrontmatterSchema,
  SessionFrontmatterSchema,
} from '../../core/types.js'
import type { ZodError } from 'zod'

interface VerifyOpts {
  json?: boolean
  orphans?: boolean
}

interface VerifyIssue {
  file: string
  type: 'schema' | 'orphan' | 'parse'
  message: string
}

function formatZodError(err: ZodError): string {
  return err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
}

async function verifyDir<Schema extends { safeParse: (data: unknown) => { success: boolean; error?: ZodError } }>(
  dir: string,
  schema: Schema,
  repoRoot: string,
  checkOrphans: boolean,
  orphanPathKey: string | null,
  orphanIsDir: boolean,
): Promise<VerifyIssue[]> {
  const issues: VerifyIssue[] = []
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch {
    return []
  }

  await Promise.all(entries.filter((e) => e.endsWith('.md')).map(async (entry) => {
    const filePath = path.join(dir, entry)
    let raw: string
    try {
      raw = await fs.readFile(filePath, 'utf8')
    } catch {
      issues.push({ file: filePath, type: 'parse', message: 'Could not read file' })
      return
    }

    let frontmatter: Record<string, unknown>
    try {
      const parsed = parseAnnotation(raw)
      frontmatter = parsed.frontmatter as Record<string, unknown>
    } catch (e) {
      issues.push({ file: filePath, type: 'parse', message: `Frontmatter parse error: ${String(e)}` })
      return
    }

    const result = schema.safeParse(frontmatter)
    if (!result.success) {
      issues.push({
        file: filePath,
        type: 'schema',
        message: formatZodError(result.error!),
      })
    }

    if (checkOrphans && orphanPathKey) {
      const subjectPath = frontmatter[orphanPathKey] as string | undefined
      if (subjectPath) {
        const fullPath = path.join(repoRoot, subjectPath)
        try {
          const stat = await fs.stat(fullPath)
          if (orphanIsDir && !stat.isDirectory()) {
            issues.push({ file: filePath, type: 'orphan', message: `Subject path is not a directory: ${subjectPath}` })
          }
        } catch {
          issues.push({ file: filePath, type: 'orphan', message: `Subject no longer exists on disk: ${subjectPath}` })
        }
      }
    }
  }))

  return issues
}

export function registerVerify(program: Command): void {
  program
    .command('verify')
    .description('Validate annotation frontmatter schemas and detect orphaned annotations')
    .option('--no-orphans', 'Skip orphan detection (only validate schemas)')
    .option('--json', 'Output issues as JSON')
    .action(async (options: VerifyOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const checkOrphans = options.orphans !== false

        const [blockIssues, fileIssues, folderIssues, sessionIssues] = await Promise.all([
          verifyDir(blocksDir(whyRoot), BlockFrontmatterSchema, repoRoot, checkOrphans, 'file', false),
          verifyDir(filesDir(whyRoot), FileFrontmatterSchema, repoRoot, checkOrphans, 'path', false),
          verifyDir(foldersDir(whyRoot), FolderFrontmatterSchema, repoRoot, checkOrphans, 'path', true),
          verifyDir(
            path.join(whyRoot, 'sessions'),
            SessionFrontmatterSchema,
            repoRoot,
            false, // sessions are permanent records — no orphan check
            null,
            false,
          ),
        ])

        const allIssues: VerifyIssue[] = [
          ...blockIssues,
          ...fileIssues,
          ...folderIssues,
          ...sessionIssues,
        ]

        if (options.json) {
          console.log(JSON.stringify(allIssues, null, 2))
          if (allIssues.length > 0) process.exit(1)
          return
        }

        if (allIssues.length === 0) {
          console.log(chalk.green('✓ All annotations valid'))
          return
        }

        const schemaIssues = allIssues.filter((i) => i.type === 'schema')
        const orphanIssues = allIssues.filter((i) => i.type === 'orphan')
        const parseIssues = allIssues.filter((i) => i.type === 'parse')

        if (schemaIssues.length > 0) {
          console.log(chalk.bold(`\nSchema violations (${schemaIssues.length})`))
          for (const issue of schemaIssues) {
            const rel = path.relative(whyRoot, issue.file)
            console.log(`  ${chalk.red('✗')} ${chalk.gray(rel)}`)
            console.log(`    ${issue.message}`)
          }
        }

        if (orphanIssues.length > 0) {
          console.log(chalk.bold(`\nOrphaned annotations (${orphanIssues.length})`))
          for (const issue of orphanIssues) {
            const rel = path.relative(whyRoot, issue.file)
            console.log(`  ${chalk.yellow('!')} ${chalk.gray(rel)}`)
            console.log(`    ${issue.message}`)
          }
          console.log(chalk.gray('\n  Run: git why clean  to remove orphaned annotations'))
        }

        if (parseIssues.length > 0) {
          console.log(chalk.bold(`\nParse errors (${parseIssues.length})`))
          for (const issue of parseIssues) {
            const rel = path.relative(whyRoot, issue.file)
            console.log(`  ${chalk.red('✗')} ${chalk.gray(rel)}`)
            console.log(`    ${issue.message}`)
          }
        }

        console.log()
        process.exit(1)
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
