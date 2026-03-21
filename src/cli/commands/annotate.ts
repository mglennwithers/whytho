import { Command } from 'commander'
import chalk from 'chalk'
import * as os from 'os'
import { findRepoRoot, getHeadCommitSha, getCurrentUser, getRecentGitLog } from '../../core/git/repo.js'
import { getChangedFiles } from '../../core/git/diff.js'
import { getWhyRoot, blockAnnotationPath, fileAnnotationPath, folderAnnotationPath, sessionAnnotationPath, buildSymbolicRef, parentFolder } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { writeFile, fileExists } from '../../core/fs/writer.js'
import { serializeAnnotation } from '../../core/frontmatter/serialize.js'
import { parseFile } from '../../core/parser/registry.js'
import { computeContentHash } from '../../core/identity/content-hash.js'
import { detectLanguage } from '../../core/parser/detect-language.js'
import { loadConfig } from '../../config/loader.js'
import { getDefaultProvider } from '../../ai/registry.js'
import { WHYTHO_VERSION } from '../../core/constants.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter, SessionFrontmatter } from '../../core/types.js'
import * as fs from 'fs/promises'

export function registerAnnotate(program: Command): void {
  program
    .command('annotate')
    .description('Generate annotations for the current AI coding session')
    .option('--session-id <id>', 'Session identifier (default: date-based)')
    .option('--model <model>', 'AI model to use')
    .option('--dry-run', 'Print annotations without writing files')
    .action(async (options) => {
      try {
        const repoRoot = await findRepoRoot()
        const config = await loadConfig(repoRoot)
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const ai = getDefaultProvider(config)
        const commitSha = await getHeadCommitSha(repoRoot)
        const changedFiles = await getChangedFiles(repoRoot)
        const now = new Date().toISOString()
        const dateStr = now.slice(0, 10)

        // Generate session ID
        const sessionId = options.sessionId ?? `${dateStr}-session-${Date.now().toString(36)}`
        const user = config.privacy.omitUser ? undefined : await getCurrentUser(repoRoot)
        const gitLog = await getRecentGitLog(repoRoot, 5)

        console.log(chalk.bold(`Generating annotations for session: ${sessionId}`))
        console.log(chalk.gray(`Changed files: ${changedFiles.length}`))

        const blocksAnnotated: string[] = []
        const filesAnnotated: string[] = []
        const touchedFolders = new Set<string>()

        // Annotate blocks in each changed file
        for (const filePath of changedFiles) {
          let source: string
          try {
            source = await fs.readFile(`${repoRoot}/${filePath}`, 'utf8')
          } catch {
            continue // File may have been deleted
          }

          const parsedBlocks = parseFile(source, filePath)
          const lang = detectLanguage(filePath)
          const folder = parentFolder(filePath)
          touchedFolders.add(folder)

          for (const block of parsedBlocks) {
            const symbolicRef = buildSymbolicRef(filePath, block.name)
            const annPath = blockAnnotationPath(whyRoot, symbolicRef)

            if (await fileExists(annPath)) {
              console.log(chalk.gray(`  skip (exists): ${symbolicRef}`))
              blocksAnnotated.push(symbolicRef)
              continue
            }

            process.stdout.write(chalk.cyan(`  annotating block: ${symbolicRef}... `))

            const result = await ai.generateAnnotation({
              type: 'block',
              context: {
                filePath,
                blockSource: block.content,
                parsedBlock: block,
                sessionContext: gitLog,
              },
            })

            const semanticFingerprint =
              (result.frontmatter['_semantic_fingerprint'] as string) ??
              `${block.kind} ${block.name} in ${filePath}`

            const blockFm: BlockFrontmatter = {
              whytho: WHYTHO_VERSION,
              type: 'block',
              symbolic_ref: symbolicRef,
              file: filePath,
              created: now,
              updated: now,
              created_by_session: sessionId,
              updated_by_session: sessionId,
              identity: {
                symbolic: symbolicRef,
                line_range: { start: block.startLine, end: block.endLine, commit: commitSha },
                content_hash: computeContentHash(block.content),
                structural: {
                  kind: block.kind,
                  parent_scope: block.parentScope,
                  name: block.name,
                  parameters: block.parameters,
                  index_in_parent: block.indexInParent,
                },
                semantic_fingerprint: semanticFingerprint,
                canonical_metric: 'symbolic',
                confidence: 0.95,
                last_resolved: commitSha,
              },
            }

            const title = `# ${block.name}\n\n`
            const body = title + result.body

            if (!options.dryRun) {
              await writeFile(annPath, serializeAnnotation(blockFm, body))
            }
            console.log(chalk.green('done'))
            blocksAnnotated.push(symbolicRef)
          }

          // Annotate file
          const fileAnnPath = fileAnnotationPath(whyRoot, filePath)
          if (!(await fileExists(fileAnnPath))) {
            process.stdout.write(chalk.cyan(`  annotating file: ${filePath}... `))
            const fileResult = await ai.generateAnnotation({
              type: 'file',
              context: { filePath, sessionContext: gitLog },
            })
            const fileFm: FileFrontmatter = {
              whytho: WHYTHO_VERSION,
              type: 'file',
              path: filePath,
              created: now,
              updated: now,
              updated_by_session: sessionId,
              parent_folder: folder,
              sessions: [sessionId],
              blocks: parsedBlocks.map((b) => buildSymbolicRef(filePath, b.name)),
              language: lang,
            }
            if (!options.dryRun) {
              await writeFile(fileAnnPath, serializeAnnotation(fileFm, fileResult.body))
            }
            console.log(chalk.green('done'))
          }
          filesAnnotated.push(filePath)
        }

        // Annotate touched folders
        for (const folder of touchedFolders) {
          const folderAnnPath = folderAnnotationPath(whyRoot, folder)
          if (!(await fileExists(folderAnnPath))) {
            process.stdout.write(chalk.cyan(`  annotating folder: ${folder}... `))
            const folderResult = await ai.generateAnnotation({
              type: 'folder',
              context: { filePath: folder, sessionContext: gitLog },
            })
            const folderFm: FolderFrontmatter = {
              whytho: WHYTHO_VERSION,
              type: 'folder',
              path: folder,
              created: now,
              updated: now,
              updated_by_session: sessionId,
              contained_files: filesAnnotated.filter((f) => parentFolder(f) === folder),
              sessions: [sessionId],
            }
            if (!options.dryRun) {
              await writeFile(folderAnnPath, serializeAnnotation(folderFm, folderResult.body))
            }
            console.log(chalk.green('done'))
          }
        }

        // Write session annotation
        const sessionPath = sessionAnnotationPath(whyRoot, sessionId)
        if (!(await fileExists(sessionPath))) {
          process.stdout.write(chalk.cyan(`  annotating session: ${sessionId}... `))
          const sessionResult = await ai.generateAnnotation({
            type: 'session',
            context: {
              sessionContext: gitLog,
              changedFiles,
              gitLog,
            },
          })
          const sessionFm: SessionFrontmatter = {
            whytho: WHYTHO_VERSION,
            type: 'session',
            id: sessionId,
            created: now,
            updated: now,
            model: config.anthropic?.model ?? 'unknown',
            model_provider: config.aiProvider,
            user,
            commits: commitSha ? [{ sha: commitSha, message: '', timestamp: now }] : [],
            files_touched: changedFiles,
            folders_touched: [...touchedFolders],
            blocks_touched: blocksAnnotated,
          }
          if (!options.dryRun) {
            await writeFile(sessionPath, serializeAnnotation(sessionFm, sessionResult.body))
          }
          console.log(chalk.green('done'))
        }

        console.log('')
        console.log(chalk.green(`✓ Annotated ${blocksAnnotated.length} blocks, ${filesAnnotated.length} files`))
        if (options.dryRun) {
          console.log(chalk.yellow('(dry run — no files written)'))
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
