import * as fs from 'fs/promises'
import * as path from 'path'
import * as https from 'https'
import type { HookEvent, RelationshipType, ResolutionOutcome } from '../types.js'
import { WHYTHO_VERSION } from '../constants.js'
import type { WhythoConfig } from '../../config/types.js'

export function buildHookEvent(params: {
  commit: string
  session?: string
  relationshipType: RelationshipType
  source: string
  target: string
  changeType: string
  targetResolution: ResolutionOutcome
  targetPreviousHash?: string
  targetCurrentHash?: string
  targetConfidence?: number
}): HookEvent {
  return {
    event: 'relationship_target_changed',
    whytho_version: WHYTHO_VERSION,
    timestamp: new Date().toISOString(),
    commit: params.commit,
    session: params.session,
    relationship: {
      type: params.relationshipType,
      source: params.source,
      target: params.target,
    },
    change: {
      type: params.changeType,
      target_resolution: params.targetResolution,
      target_previous_hash: params.targetPreviousHash,
      target_current_hash: params.targetCurrentHash,
      target_confidence: params.targetConfidence,
    },
  }
}

export async function emitHookEvents(
  events: HookEvent[],
  config: WhythoConfig,
  repoRoot: string,
): Promise<void> {
  if (events.length === 0) return

  const tasks: Promise<void>[] = []

  // Write to file if configured
  if (config.hooks.onRelationshipChanged) {
    tasks.push(writeEventsToFile(events, config.hooks.onRelationshipChanged, repoRoot))
  }

  // Post to webhook if configured
  if (config.hooks.webhookUrl) {
    tasks.push(postEventsToWebhook(events, config.hooks.webhookUrl))
  }

  // If no output configured, write to .why/events.ndjson by default
  if (!config.hooks.onRelationshipChanged && !config.hooks.webhookUrl) {
    const eventsFile = path.join(repoRoot, '.why', 'events.ndjson')
    tasks.push(appendEventsToFile(events, eventsFile))
  }

  await Promise.allSettled(tasks)
}

async function writeEventsToFile(
  events: HookEvent[],
  scriptPath: string,
  repoRoot: string,
): Promise<void> {
  const { spawn } = await import('child_process')
  const input = events.map((e) => JSON.stringify(e)).join('\n')
  const resolvedScript = path.resolve(repoRoot, scriptPath)

  await new Promise<void>((resolve) => {
    const proc = spawn(resolvedScript, [], { stdio: ['pipe', 'inherit', 'inherit'] })
    proc.stdin.write(input)
    proc.stdin.end()
    const timer = setTimeout(() => { proc.kill(); resolve() }, 10_000)
    proc.on('close', () => { clearTimeout(timer); resolve() })
    proc.on('error', () => { clearTimeout(timer); resolve() })
  })
}

async function postEventsToWebhook(events: HookEvent[], webhookUrl: string): Promise<void> {
  const body = JSON.stringify(events)
  return new Promise((resolve) => {
    try {
      const url = new URL(webhookUrl)
      const req = https.request(
        {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
        },
        () => resolve(),
      )
      req.on('error', () => resolve())
      req.setTimeout(10_000, () => { req.destroy(); resolve() })
      req.write(body)
      req.end()
    } catch {
      resolve()
    }
  })
}

async function appendEventsToFile(events: HookEvent[], filePath: string): Promise<void> {
  const lines = `${events.map((e) => JSON.stringify(e)).join('\n')  }\n`
  await fs.appendFile(filePath, lines, 'utf8')
}
