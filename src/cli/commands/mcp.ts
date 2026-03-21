import { Command } from 'commander'

export function registerMcp(program: Command): void {
  program
    .command('mcp')
    .description('Start the whytho MCP server (stdio transport) for use with Claude Code and other MCP clients')
    .action(async () => {
      try {
        const { startMcpServer } = await import('../../mcp/server.js')
        await startMcpServer()
      } catch (err) {
        process.stderr.write(`Error starting MCP server: ${String(err)}\n`)
        process.exit(1)
      }
    })
}
