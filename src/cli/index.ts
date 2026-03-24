import { Command } from 'commander'
import { registerInit } from './commands/init.js'
import { registerAnnotate } from './commands/annotate.js'
import { registerBlock } from './commands/block.js'
import { registerFile } from './commands/file.js'
import { registerFolder } from './commands/folder.js'
import { registerSession } from './commands/session.js'
import { registerRelated } from './commands/related.js'
import { registerHistory } from './commands/history.js'
import { registerDiff } from './commands/diff.js'
import { registerResolve } from './commands/resolve.js'
import { registerScan } from './commands/scan.js'
import { registerPush } from './commands/push.js'
import { registerInfer } from './commands/infer.js'
import { registerMcp } from './commands/mcp.js'
import { registerSearch } from './commands/search.js'
import { registerStatus } from './commands/status.js'
import { registerReannotate } from './commands/reannotate.js'

const program = new Command()
  .name('git why')
  .description('The open standard for persisting AI reasoning alongside your code')
  .version('1.0.0')

registerInit(program)
registerAnnotate(program)
registerBlock(program)
registerFile(program)
registerFolder(program)
registerSession(program)
registerRelated(program)
registerHistory(program)
registerDiff(program)
registerResolve(program)
registerScan(program)
registerPush(program)
registerInfer(program)
registerMcp(program)
registerSearch(program)
registerStatus(program)
registerReannotate(program)

program.parse(process.argv)
