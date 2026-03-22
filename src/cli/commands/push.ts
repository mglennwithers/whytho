import { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { pushReasoning, type PushType } from '../../core/push/index.js'
import { RELATIONSHIP_TYPES } from '../../core/constants.js'

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return ''
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => { data += chunk })
    process.stdin.on('end', () => resolve(data.trim()))
  })
}

export function registerPush(program: Command): void {
  program
    .command('push <type> [ref]')
    .description(
      'Push agent reasoning directly into an annotation\n' +
      '  Types: session [id]  block <file::name>  file <path>\n' +
      '  Example: git why push block src/foo.ts::myFn --body "I chose X because..."\n' +
      '  Relationships: --relate-to <file::block> --relation-type <type>\n' +
      `  Relationship types: ${RELATIONSHIP_TYPES.join(', ')}`,
    )
    .option('--body <text>', 'Reasoning text (reads from stdin if omitted)')
    .option('--session-id <id>', 'Associate this note with a session ID')
    .option('--relate-to <ref>', 'Add a relationship to another block (repeatable)', (v, acc: string[]) => [...acc, v], [] as string[])
    .option('--relation-type <type>', 'Relationship type for --relate-to (default: depends_on)', 'depends_on')
    .option('--relation-description <text>', 'Human-readable description for the relationship')
    .option('--bidirectional', 'Mark relationship as bidirectional')
    .action(async (type: string, ref: string | undefined, options) => {
      try {
        const validTypes: PushType[] = ['session', 'block', 'file']
        if (!validTypes.includes(type as PushType)) {
          console.error(chalk.red(`Error: type must be one of: ${validTypes.join(', ')}`))
          process.exit(1)
        }

        if (type === 'session' && !ref) ref = 'latest'

        if (!ref) {
          console.error(chalk.red(`Error: ref is required for type '${type}'`))
          process.exit(1)
        }

        let body = options.body as string | undefined
        if (!body) {
          body = await readStdin()
        }
        if (!body) {
          console.error(chalk.red('Error: provide --body <text> or pipe reasoning to stdin'))
          process.exit(1)
        }

        const repoRoot = await findRepoRoot()
        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        // Build relationships from --relate-to flags
        const relTargets = (options.relateTo as string[]) ?? []
        const relationships = relTargets.length > 0
          ? relTargets.map((target) => ({
              target,
              type: options.relationType as string,
              description: options.relationDescription as string | undefined,
              bidirectional: options.bidirectional as boolean | undefined,
            }))
          : undefined

        if (relationships && type !== 'block') {
          console.warn(chalk.yellow('Warning: --relate-to is only supported for block annotations'))
        }

        const result = await pushReasoning({
          repoRoot,
          type: type as PushType,
          ref,
          body,
          sessionId: options.sessionId as string | undefined,
          relationships: type === 'block' ? relationships : undefined,
        })

        const label = type === 'session' ? ref : ref
        console.log(chalk.green(`✓ ${result.action} ${type} annotation: ${label}`))
        if (relationships && type === 'block') {
          for (const rel of relationships) {
            console.log(chalk.gray(`  + relationship: ${rel.type} → ${rel.target}`))
          }
        }
        console.log(chalk.gray(`  ${result.path}`))
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
